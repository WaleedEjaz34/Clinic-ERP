import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-6">
        <div
          className={`relative w-full ${maxWidth} bg-white rounded-t-3xl sm:rounded-2xl shadow-modal border-t sm:border border-slate-200/90 overflow-hidden transform transition-all animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile top pull pill handle */}
          <div className="pt-2 pb-0.5 sm:hidden flex justify-center bg-slate-50/90 flex-shrink-0">
            <div className="w-12 h-1 bg-slate-300 rounded-full" />
          </div>

          {/* Top subtle brand accent line */}
          <div className="h-1 bg-gradient-to-r from-brand-600 via-teal-500 to-indigo-600 w-full flex-shrink-0" />

          {/* Modal Header (Sticky) */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/90 backdrop-blur-xs flex-shrink-0 sticky top-0 z-10">
            <div className="min-w-0 pr-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body with internal scrolling */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 text-slate-700 text-xs overscroll-contain">
            {children}
          </div>

          {/* Sticky Bottom Action Bar Footer */}
          {footer && (
            <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-100 bg-slate-50/95 backdrop-blur-xs flex items-center justify-end gap-2 flex-shrink-0 sticky bottom-0 z-10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
