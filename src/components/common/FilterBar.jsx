import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';
import { SearchInput } from './SearchInput';

export const FilterBar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  children,
  onResetFilters,
  hasActiveFilters = false,
  totalResults,
}) => {
  return (
    <div className="relative z-10 bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 mb-4 sm:mb-6 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-3.5">
      {/* Search Bar & Custom Select Filters */}
      <div className="flex flex-1 flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
        <div className="w-full sm:w-auto min-w-0 sm:min-w-[220px] max-w-sm flex-1">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>

        {/* Custom Filter Selects passed as children */}
        <div className="flex flex-wrap items-center gap-2">
          {children}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-xl transition-colors shadow-2xs"
            title="Reset all search and filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Record Counter Badge */}
      {totalResults !== undefined && (
        <div className="flex items-center justify-end text-xs text-slate-500 whitespace-nowrap px-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 rounded-full font-medium text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            Total: <strong className="text-slate-900 font-bold">{totalResults}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
