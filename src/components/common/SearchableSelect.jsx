import React, { useState, useRef, useEffect, useMemo, useId } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, Check, X, Plus } from 'lucide-react';

/**
 * Extracts plain text recursively from React nodes or strings.
 */
function extractText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) return extractText(node.props.children);
  return '';
}

/**
 * Parses React <option> and <optgroup> children into normalized option objects.
 */
function parseChildrenToOptions(children) {
  const result = [];
  const flatChildren = React.Children.toArray(children);

  flatChildren.forEach((child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === 'option') {
      const val = child.props.value !== undefined ? child.props.value : extractText(child.props.children);
      const textLabel = extractText(child.props.children) || String(val);
      result.push({
        value: val,
        label: textLabel,
        node: child.props.children,
        disabled: Boolean(child.props.disabled),
        className: child.props.className,
      });
    } else if (child.type === 'optgroup') {
      const groupLabel = child.props.label || '';
      const subChildren = React.Children.toArray(child.props.children);
      subChildren.forEach((sub) => {
        if (React.isValidElement(sub) && sub.type === 'option') {
          const val = sub.props.value !== undefined ? sub.props.value : extractText(sub.props.children);
          const textLabel = extractText(sub.props.children) || String(val);
          result.push({
            value: val,
            label: textLabel,
            node: sub.props.children,
            disabled: Boolean(sub.props.disabled),
            group: groupLabel,
            className: sub.props.className,
          });
        }
      });
    }
  });

  return result;
}

/**
 * Highlight matching text segments for visual search feedback.
 */
function HighlightMatch({ text, query }) {
  if (!query || !text) return <span>{text}</span>;
  const strText = String(text);
  const q = query.trim().toLowerCase();
  const index = strText.toLowerCase().indexOf(q);

  if (index === -1) return <span>{strText}</span>;

  const before = strText.slice(0, index);
  const match = strText.slice(index, index + q.length);
  const after = strText.slice(index + q.length);

  return (
    <span>
      {before}
      <span className="bg-amber-100 text-amber-900 font-bold rounded-xs px-0.5 underline decoration-amber-400">
        {match}
      </span>
      {after}
    </span>
  );
}

/**
 * SearchableSelect
 * A modern, accessible, searchable dropdown component that can replace standard <select> tags.
 * Works seamlessly with both `options={[...]}` array and standard `<option>` children.
 */
export const SearchableSelect = ({
  options: propOptions,
  children,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  className = '',
  containerClassName = '',
  menuClassName = '',
  disabled = false,
  required = false,
  name = '',
  id: propId,
  allowClear = false,
  allowCustom = false,
  renderOption,
  renderTrigger,
  placement = 'auto', // 'auto', 'bottom', 'top'
  maxMenuHeight = 'max-h-60',
  autoSelectFirst = false,
}) => {
  const generatedId = useId();
  const selectId = propId || generatedId;
  const listboxId = `${selectId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPlacement, setDropdownPlacement] = useState('bottom');
  const [menuCoords, setMenuCoords] = useState({
    top: undefined,
    bottom: undefined,
    left: 0,
    width: 200,
    maxHeight: 320,
    placement: 'bottom',
  });

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  const menuRef = useRef(null);

  // Normalize options from propOptions or children
  const normalizedOptions = useMemo(() => {
    if (propOptions && Array.isArray(propOptions)) {
      return propOptions.map((opt) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
          return { value: opt, label: String(opt), node: String(opt) };
        }
        return {
          value: opt.value !== undefined ? opt.value : opt.id || opt.name,
          label: opt.label !== undefined ? String(opt.label) : opt.name || String(opt.value),
          sublabel: opt.sublabel || opt.description || opt.details || opt.specialization || opt.category || '',
          badge: opt.badge,
          badgeColor: opt.badgeColor,
          icon: opt.icon,
          disabled: Boolean(opt.disabled),
          group: opt.group,
          node: opt.label || opt.name || String(opt.value),
        };
      });
    }

    if (children) {
      return parseChildrenToOptions(children);
    }

    return [];
  }, [propOptions, children]);

  // Current selected option object
  const selectedOption = useMemo(() => {
    if (value === undefined || value === null) return null;
    return normalizedOptions.find((opt) => String(opt.value) === String(value)) || null;
  }, [normalizedOptions, value]);

  // Filtered options based on searchQuery
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const query = searchQuery.trim().toLowerCase();

    return normalizedOptions.filter((opt) => {
      const labelMatch = opt.label && opt.label.toLowerCase().includes(query);
      const valMatch = opt.value !== undefined && String(opt.value).toLowerCase().includes(query);
      const sublabelMatch = opt.sublabel && opt.sublabel.toLowerCase().includes(query);
      const groupMatch = opt.group && opt.group.toLowerCase().includes(query);
      return labelMatch || valMatch || sublabelMatch || groupMatch;
    });
  }, [normalizedOptions, searchQuery]);

  // Can show "create custom" option if allowed and not an exact match
  const showCustomOption = useMemo(() => {
    if (!allowCustom || !searchQuery.trim()) return false;
    const exactMatch = normalizedOptions.some(
      (opt) => opt.label.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    return !exactMatch;
  }, [allowCustom, searchQuery, normalizedOptions]);

  // Compute collision-aware viewport coordinates for the floating dropdown portal
  const computePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    if (triggerRect.width === 0 && triggerRect.height === 0) return;

    // Auto-close if trigger is completely outside visible viewport
    if (triggerRect.bottom < 0 || triggerRect.top > window.innerHeight) {
      setIsOpen(false);
      return;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Detect sticky header clearance (top buffer to prevent covering navbar)
    const headerEl = document.querySelector('header');
    const headerBottom = headerEl ? Math.max(0, headerEl.getBoundingClientRect().bottom) : 0;
    const topLimit = headerBottom + 6;

    // Detect mobile bottom nav clearance (only when visible on mobile/tablet screens)
    const mobileNav = document.querySelector('nav.fixed.bottom-0');
    let mobileNavTop = windowHeight;
    if (mobileNav) {
      const rect = mobileNav.getBoundingClientRect();
      if (rect.height > 0 && rect.top > 0) {
        mobileNavTop = rect.top;
      }
    }
    const bottomLimit = Math.min(windowHeight, mobileNavTop) - 6;

    // Calculate available screen space above and below the trigger
    const spaceBelow = Math.max(0, bottomLimit - triggerRect.bottom - 4);
    const spaceAbove = Math.max(0, triggerRect.top - topLimit - 4);

    // Decide direction: 'bottom' (downward) vs 'top' (upward)
    let chosenDirection = 'bottom';
    if (placement === 'top') {
      chosenDirection = 'top';
    } else if (placement === 'bottom') {
      chosenDirection = 'bottom';
    } else {
      // Auto placement logic:
      // If there is comfortable space below (>= 220px), open downwards by default
      if (spaceBelow >= 220) {
        chosenDirection = 'bottom';
      } else if (spaceAbove > spaceBelow && spaceAbove >= 150) {
        // More room above and at least 150px
        chosenDirection = 'top';
      } else {
        // Fall back to whichever side has more room
        chosenDirection = spaceBelow >= spaceAbove ? 'bottom' : 'top';
      }
    }

    // Determine maxHeight clamped to available space so it never clips or overlaps
    const availableHeight = chosenDirection === 'top' ? spaceAbove : spaceBelow;
    const maxHeight = Math.min(340, Math.max(130, availableHeight));

    // Target width: at least trigger width, min 180px, max windowWidth - 20px
    const defaultMinWidth = menuClassName && menuClassName.includes('min-w-[90px]') ? 100 : 180;
    const targetWidth = Math.min(Math.max(triggerRect.width, defaultMinWidth), windowWidth - 20);

    // Horizontal position (left) with edge clamping
    let left = triggerRect.left;
    if (left + targetWidth > windowWidth - 10) {
      left = triggerRect.right - targetWidth;
    }
    if (left + targetWidth > windowWidth - 10) {
      left = windowWidth - targetWidth - 10;
    }
    if (left < 10) {
      left = 10;
    }

    // Vertical position (top / bottom)
    let top;
    let bottom;
    if (chosenDirection === 'bottom') {
      top = triggerRect.bottom + 4;
      bottom = undefined;
    } else {
      top = undefined;
      bottom = windowHeight - triggerRect.top + 4;
    }

    setMenuCoords({
      top,
      bottom,
      left,
      width: targetWidth,
      maxHeight,
      placement: chosenDirection,
    });
    setDropdownPlacement(chosenDirection);
  };

  // Re-compute positioning on open, scroll (including parent containers), and window resize
  useEffect(() => {
    if (!isOpen) return;

    computePosition();

    const handleUpdate = () => {
      computePosition();
    };

    window.addEventListener('resize', handleUpdate);
    document.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      document.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isOpen, placement]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      // Find index of currently selected option in filtered list
      const initialIndex = filteredOptions.findIndex(
        (opt) => selectedOption && opt.value === selectedOption.value
      );
      setHighlightedIndex(initialIndex >= 0 ? initialIndex : 0);

      // Timeout ensures the input is mounted and rendered
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 30);
      return () => clearTimeout(timer);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Close dropdown on outside click (checks both trigger container and portal menu)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick, true);
      document.addEventListener('touchstart', handleOutsideClick, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('touchstart', handleOutsideClick, true);
    };
  }, [isOpen]);

  // Select an option and trigger onChange
  const handleSelect = (optionValue) => {
    if (disabled) return;

    // Build synthetic event to match React's HTML Select change event
    const syntheticEvent = {
      target: {
        name: name || '',
        value: optionValue,
      },
      currentTarget: {
        name: name || '',
        value: optionValue,
      },
      value: optionValue,
      preventDefault: () => {},
      stopPropagation: () => {},
    };

    if (onChange) {
      onChange(syntheticEvent, optionValue);
    }

    setIsOpen(false);
    setSearchQuery('');
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    handleSelect('');
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    // Dropdown is open
    const totalItems = filteredOptions.length + (showCustomOption ? 1 : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (showCustomOption && highlightedIndex === filteredOptions.length) {
          handleSelect(searchQuery.trim());
        } else if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else if (filteredOptions.length === 1 && !filteredOptions[0].disabled) {
          handleSelect(filteredOptions[0].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Check if current value has a selection
  const hasValue = value !== undefined && value !== null && value !== '';

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left w-full ${containerClassName}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for standard HTML form submission / validation */}
      <input
        type="hidden"
        name={name}
        id={selectId}
        value={value !== undefined && value !== null ? value : ''}
        required={required && !hasValue}
      />

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={`${selectId}-button`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 transition-all cursor-pointer select-none text-left focus:outline-none ${
          // If custom className provided, use it; otherwise use polished standard styling
          className
            ? className
            : 'bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-medium shadow-2xs hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''} ${
          isOpen ? 'ring-2 ring-brand-500/20 border-brand-500' : ''
        }`}
      >
        {renderTrigger ? (
          renderTrigger(selectedOption, { isOpen, placeholder, hasValue })
        ) : (
          <span className="truncate flex-1 flex items-center gap-1.5 min-w-0">
            {selectedOption?.icon && (
              <span className="flex-shrink-0 text-slate-500">{selectedOption.icon}</span>
            )}
            <span
              className={`truncate ${
                selectedOption
                  ? 'text-slate-800 font-semibold'
                  : 'text-slate-400 font-normal'
              }`}
            >
              {selectedOption
                ? selectedOption.node || selectedOption.label
                : (allowCustom && hasValue ? String(value) : placeholder)}
            </span>
            {selectedOption?.badge && (
              <span
                className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  selectedOption.badgeColor || 'bg-brand-50 text-brand-700 border border-brand-200/60'
                }`}
              >
                {selectedOption.badge}
              </span>
            )}
          </span>
        )}

        <div className="flex items-center gap-1 flex-shrink-0 ml-1 text-slate-400">
          {allowClear && hasValue && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              className="p-0.5 hover:text-rose-500 rounded-full transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-brand-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popover via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={`${selectId}-button`}
          onKeyDown={handleKeyDown}
          className={`bg-white rounded-xl shadow-2xl border border-slate-200/90 py-1.5 text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-150 flex flex-col ${menuClassName}`}
          style={{
            position: 'fixed',
            top: menuCoords.top !== undefined ? `${menuCoords.top}px` : undefined,
            bottom: menuCoords.bottom !== undefined ? `${menuCoords.bottom}px` : undefined,
            left: `${menuCoords.left}px`,
            width: `${menuCoords.width}px`,
            maxHeight: `${menuCoords.maxHeight}px`,
            zIndex: 99999,
          }}
        >
          {/* Integrated Search Box */}
          <div className="px-2.5 pt-1 pb-2 border-b border-slate-100 flex-shrink-0">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={(e) => {
                  // Keep search input focused on space and letters
                  if (e.key === ' ' && !searchQuery) {
                    e.stopPropagation();
                  }
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    setSearchQuery('');
                    if (searchInputRef.current) searchInputRef.current.focus();
                  }}
                  className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {/* Search metadata count */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1">
              <span>{filteredOptions.length} available</span>
              {searchQuery && (
                <span className="text-brand-600 font-semibold truncate max-w-[120px]">
                  Matching: "{searchQuery}"
                </span>
              )}
            </div>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            className="flex-1 min-h-0 overflow-y-auto px-1 py-1 space-y-0.5 overscroll-contain"
          >
            {filteredOptions.length === 0 && !showCustomOption ? (
              <div className="py-6 px-3 text-center text-slate-400">
                <Search className="w-6 h-6 mx-auto mb-1.5 opacity-30 text-slate-500" />
                <p className="text-xs font-semibold text-slate-600">No options found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Try typing a different keyword
                </p>
              </div>
            ) : (
              <>
                {filteredOptions.map((opt, idx) => {
                  const isSelected = selectedOption && String(selectedOption.value) === String(opt.value);
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <div
                      key={opt.value !== undefined ? String(opt.value) : idx}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      onClick={() => !opt.disabled && handleSelect(opt.value)}
                      onMouseEnter={() => !opt.disabled && setHighlightedIndex(idx)}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed bg-transparent'
                          : isSelected
                          ? 'bg-brand-50 text-brand-900 font-bold'
                          : isHighlighted
                          ? 'bg-slate-100 text-slate-900 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                        {opt.icon && (
                          <span
                            className={`flex-shrink-0 ${
                              isSelected ? 'text-brand-600' : 'text-slate-400'
                            }`}
                          >
                            {opt.icon}
                          </span>
                        )}

                        <div className="min-w-0 flex-1">
                          {renderOption ? (
                            renderOption(opt, { isSelected, isHighlighted, searchQuery })
                          ) : (
                            <>
                              <div className="truncate text-xs leading-snug">
                                {searchQuery ? (
                                  <HighlightMatch text={opt.label} query={searchQuery} />
                                ) : (
                                  opt.node || opt.label
                                )}
                              </div>
                              {opt.sublabel && (
                                <div className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">
                                  {searchQuery ? (
                                    <HighlightMatch text={opt.sublabel} query={searchQuery} />
                                  ) : (
                                    opt.sublabel
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {opt.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                              opt.badgeColor || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-brand-600 stroke-[2.5]" />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Creatable / Custom option when allowed */}
                {showCustomOption && (
                  <div
                    role="option"
                    aria-selected={false}
                    onClick={() => handleSelect(searchQuery.trim())}
                    onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors border-t border-slate-100 mt-1 ${
                      highlightedIndex === filteredOptions.length
                        ? 'bg-brand-50 text-brand-900'
                        : 'text-brand-700 hover:bg-brand-50/70'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-600" />
                    <span className="text-xs font-semibold">
                      Use custom: <strong className="text-brand-900">"{searchQuery.trim()}"</strong>
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
