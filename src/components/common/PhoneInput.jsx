import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, Phone, AlertCircle } from 'lucide-react';
import {
  COUNTRY_CODES,
  getCountryByDialCode,
  cleanDigits,
  parsePhoneNumber,
  formatNationalDigits,
  validatePhoneNumber,
} from '../../utils/phoneUtils';

export const PhoneInput = ({
  value = '',
  onChange,
  onBlur,
  name = 'phone',
  id = 'phone',
  label,
  required = false,
  disabled = false,
  placeholder,
  className = '',
  error: propError,
  helperText,
}) => {
  // Parse initial incoming value
  const initialParsed = useMemo(() => {
    return parsePhoneNumber(value, '+92');
  }, []);

  const [selectedCountry, setSelectedCountry] = useState(initialParsed.country || COUNTRY_CODES[0]);
  const [nationalDigits, setNationalDigits] = useState(initialParsed.nationalDigits || '');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [countryMenuCoords, setCountryMenuCoords] = useState({ top: 0, left: 0, width: 260 });

  const containerRef = useRef(null);
  const countryBtnRef = useRef(null);
  const countryMenuRef = useRef(null);
  const inputRef = useRef(null);

  // Sync internal state when external value changes
  useEffect(() => {
    const parsed = parsePhoneNumber(value, selectedCountry.dialCode);
    if (parsed.country.code !== selectedCountry.code) {
      setSelectedCountry(parsed.country);
    }
    setNationalDigits(parsed.nationalDigits);
  }, [value]);

  // Filter country list by search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRY_CODES;
    const q = countrySearch.trim().toLowerCase();
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  // Formatted display in text field: e.g. "333 4199233"
  const formattedDisplay = useMemo(() => {
    return formatNationalDigits(nationalDigits, selectedCountry.dialCode);
  }, [nationalDigits, selectedCountry.dialCode]);

  // Validation state
  const validation = useMemo(() => {
    const fullValue = nationalDigits ? `${selectedCountry.dialCode} ${formattedDisplay}` : '';
    return validatePhoneNumber(fullValue, required, selectedCountry.dialCode);
  }, [nationalDigits, formattedDisplay, selectedCountry.dialCode, required]);

  // Determine error to display
  const displayError = propError || (isTouched && !validation.isValid ? validation.error : null);

  // Emit change to parent
  const emitChange = (newDigits, country) => {
    const formattedNat = formatNationalDigits(newDigits, country.dialCode);
    const fullFormatted = newDigits ? `${country.dialCode} ${formattedNat}` : '';
    const valid = validatePhoneNumber(fullFormatted, required, country.dialCode).isValid;

    if (onChange) {
      // Support standard synthetic event pattern: e.target.value
      const syntheticEvent = {
        target: { name, value: fullFormatted },
        currentTarget: { name, value: fullFormatted },
        value: fullFormatted,
      };
      onChange(syntheticEvent, fullFormatted, valid, newDigits);
    }
  };

  // Handle national digits input change
  const handleInputChange = (e) => {
    if (disabled) return;
    const rawVal = e.target.value;

    // Extract digits only
    let digits = cleanDigits(rawVal);

    // Rule for Pakistan (+92):
    // First digit must NOT be 0. If user types or pastes 0, strip it immediately!
    if (selectedCountry.dialCode === '+92') {
      while (digits.startsWith('0')) {
        digits = digits.slice(1);
      }
      // Maximum exactly 10 digits
      if (digits.length > 10) {
        digits = digits.slice(0, 10);
      }
    } else {
      if (digits.length > selectedCountry.digits) {
        digits = digits.slice(0, selectedCountry.digits);
      }
    }

    setNationalDigits(digits);
    emitChange(digits, selectedCountry);
  };

  // Handle paste events (e.g. pasting "+92 333 4199233" or "03334199233")
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    if (!pasted) return;

    e.preventDefault();
    const parsed = parsePhoneNumber(pasted, selectedCountry.dialCode);

    setSelectedCountry(parsed.country);
    setNationalDigits(parsed.nationalDigits);
    emitChange(parsed.nationalDigits, parsed.country);
  };

  // Switch country
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setIsCountryOpen(false);
    setCountrySearch('');

    let adjustedDigits = nationalDigits;
    // Apply rules for newly selected country
    if (country.dialCode === '+92') {
      while (adjustedDigits.startsWith('0')) {
        adjustedDigits = adjustedDigits.slice(1);
      }
      if (adjustedDigits.length > 10) {
        adjustedDigits = adjustedDigits.slice(0, 10);
      }
    } else if (adjustedDigits.length > country.digits) {
      adjustedDigits = adjustedDigits.slice(0, country.digits);
    }

    setNationalDigits(adjustedDigits);
    emitChange(adjustedDigits, country);
    if (inputRef.current) inputRef.current.focus();
  };

  // Compute position for country code dropdown portal
  const updateCountryCoords = () => {
    if (!countryBtnRef.current) return;
    const rect = countryBtnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const width = 280;

    let left = rect.left;
    if (left + width > window.innerWidth - 10) {
      left = window.innerWidth - width - 10;
    }
    if (left < 10) left = 10;

    let top = rect.bottom + 4;
    let bottom = undefined;
    const maxHeight = 300;

    if (spaceBelow < 220 && rect.top > spaceBelow) {
      top = undefined;
      bottom = window.innerHeight - rect.top + 4;
    }

    setCountryMenuCoords({ top, bottom, left, width, maxHeight });
  };

  // Toggle country dropdown
  const toggleCountryDropdown = () => {
    if (disabled) return;
    if (!isCountryOpen) {
      updateCountryCoords();
      setIsCountryOpen(true);
      setCountrySearch('');
    } else {
      setIsCountryOpen(false);
    }
  };

  // Click outside listener for country dropdown
  useEffect(() => {
    if (!isCountryOpen) return;

    updateCountryCoords();

    const handleOutsideClick = (e) => {
      if (
        countryBtnRef.current &&
        !countryBtnRef.current.contains(e.target) &&
        countryMenuRef.current &&
        !countryMenuRef.current.contains(e.target)
      ) {
        setIsCountryOpen(false);
      }
    };

    const handleScrollResize = () => {
      updateCountryCoords();
    };

    document.addEventListener('mousedown', handleOutsideClick, true);
    document.addEventListener('touchstart', handleOutsideClick, true);
    window.addEventListener('resize', handleScrollResize);
    document.addEventListener('scroll', handleScrollResize, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
      document.removeEventListener('touchstart', handleOutsideClick, true);
      window.removeEventListener('resize', handleScrollResize);
      document.removeEventListener('scroll', handleScrollResize, true);
    };
  }, [isCountryOpen]);

  const maxDigits = selectedCountry.digits;
  const currentCount = nationalDigits.length;
  const isComplete = currentCount === maxDigits;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
          </span>
          {nationalDigits && (
            <span
              className={`text-[10px] font-semibold tracking-tight transition-colors ${
                isComplete ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {currentCount}/{maxDigits} digits
            </span>
          )}
        </label>
      )}

      {/* Input container */}
      <div
        ref={containerRef}
        className={`relative flex items-center bg-white border rounded-xl shadow-2xs transition-all focus-within:ring-2 ${
          displayError
            ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/20'
            : isComplete
            ? 'border-emerald-400 focus-within:border-emerald-500 focus-within:ring-emerald-500/20'
            : 'border-slate-200 focus-within:border-brand-500 focus-within:ring-brand-500/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
      >
        {/* Country Code Selector Button */}
        <button
          ref={countryBtnRef}
          type="button"
          disabled={disabled}
          onClick={toggleCountryDropdown}
          aria-haspopup="listbox"
          aria-expanded={isCountryOpen}
          className="flex items-center gap-1.5 px-3 py-2 border-r border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 rounded-l-xl text-xs font-bold text-slate-800 transition-colors select-none flex-shrink-0 focus:outline-none"
          title={`Selected country: ${selectedCountry.name} (${selectedCountry.dialCode})`}
        >
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="font-semibold tracking-tight text-slate-800">{selectedCountry.dialCode}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
              isCountryOpen ? 'rotate-180 text-brand-600' : ''
            }`}
          />
        </button>

        {/* National Number Input */}
        <div className="relative flex-1 flex items-center min-w-0">
          <input
            ref={inputRef}
            type="tel"
            id={id}
            name={name}
            disabled={disabled}
            required={required}
            value={formattedDisplay}
            onChange={handleInputChange}
            onPaste={handlePaste}
            onBlur={(e) => {
              setIsTouched(true);
              if (onBlur) onBlur(e);
            }}
            placeholder={placeholder || selectedCountry.placeholder}
            className="w-full pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none tracking-wide"
            autoComplete="tel"
          />

          {/* Validation Status Indicator */}
          <div className="absolute right-2.5 flex items-center pointer-events-none">
            {isComplete ? (
              <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-600" title="Complete valid phone number">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            ) : displayError ? (
              <span className="text-rose-500" title={displayError}>
                <AlertCircle className="w-4 h-4" />
              </span>
            ) : (
              <Phone className="w-3.5 h-3.5 text-slate-300" />
            )}
          </div>
        </div>
      </div>

      {/* Error / Helper Message */}
      {displayError ? (
        <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-500" />
          <span>{displayError}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
      ) : null}

      {/* Country Code Dropdown Portal */}
      {isCountryOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={countryMenuRef}
          role="listbox"
          className="bg-white rounded-xl shadow-2xl border border-slate-200/90 py-1.5 text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
          style={{
            position: 'fixed',
            top: countryMenuCoords.top !== undefined ? `${countryMenuCoords.top}px` : undefined,
            bottom: countryMenuCoords.bottom !== undefined ? `${countryMenuCoords.bottom}px` : undefined,
            left: `${countryMenuCoords.left}px`,
            width: `${countryMenuCoords.width}px`,
            maxHeight: `${countryMenuCoords.maxHeight}px`,
            zIndex: 99999,
          }}
        >
          {/* Country Search Bar */}
          <div className="px-2.5 pt-1 pb-2 border-b border-slate-100 flex-shrink-0">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search country or code..."
                autoFocus
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="flex-1 min-h-0 overflow-y-auto px-1 py-1 space-y-0.5">
            {filteredCountries.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                No matching country found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === selectedCountry.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-left transition-colors ${
                      isSelected
                        ? 'bg-brand-50 text-brand-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base flex-shrink-0">{c.flag}</span>
                      <span className="truncate text-xs">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className="text-[11px] text-slate-500 font-mono">{c.dialCode}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
