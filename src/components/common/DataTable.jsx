import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
} from 'lucide-react';
import { SearchableSelect } from './SearchableSelect';

export const DataTable = ({
  columns,
  data = [],
  keyField = 'id',
  isLoading = false,
  emptyMessage = 'No records found matching your filters.',
  emptyAction,
  rowsPerPageOptions = [5, 10, 20, 50],
  defaultRowsPerPage = 10,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();

      if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  // Pagination
  const totalRecords = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, safePage, rowsPerPage]);

  const handleSort = (columnKey, sortable = true) => {
    if (!sortable) return;
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  // Find actions column and status column if any
  const actionColumn = columns.find((c) => (c.key || '').toLowerCase().includes('action') || (c.label || '').toLowerCase().includes('action'));
  const statusColumn = columns.find((c) => (c.key || '').toLowerCase().includes('status'));
  const nonActionColumns = columns.filter((c) => c !== actionColumn);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* Mobile Records Header (md:hidden) */}
      <div className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border-b border-slate-200/80 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">
          Showing {paginatedData.length} of {totalRecords} record{totalRecords !== 1 ? 's' : ''}
        </span>
        <span className="text-[11px] font-medium text-slate-400">Card View</span>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="flex flex-col items-center justify-center gap-2.5">
            <Loader2 className="w-7 h-7 animate-spin text-brand-600" />
            <span className="text-xs font-semibold text-slate-700">Loading clinical records...</span>
            <p className="text-[11px] text-slate-400">Syncing with local clinic database</p>
          </div>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="py-20 text-center text-slate-500 px-4">
          <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
            <div className="p-4 bg-slate-100/90 rounded-2xl text-slate-400 shadow-inner">
              <Inbox className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-slate-800">{emptyMessage}</span>
            <p className="text-xs text-slate-400">
              Try adjusting your search query, status filters, or clear all filters to see records.
            </p>
            {emptyAction && <div className="mt-2">{emptyAction}</div>}
          </div>
        </div>
      ) : (
        <>
          {/* ================= MOBILE CARDS VIEW (Strictly md:hidden) ================= */}
          <div className="md:hidden p-2.5 sm:p-3.5 space-y-2.5 bg-slate-50/60">
            {paginatedData.map((row, rowIndex) => {
              // Extract status render if exists
              const statusRender = statusColumn
                ? statusColumn.render
                  ? statusColumn.render(row[statusColumn.key], row, rowIndex)
                  : row[statusColumn.key]
                : null;

              // Remaining detail columns excluding primary (idx 0), secondary (idx 1), and status
              const detailColumns = nonActionColumns.slice(1).filter((c) => c !== statusColumn);

              return (
                <div
                  key={row[keyField] || rowIndex}
                  className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm space-y-3 hover:border-brand-300 transition-all active:bg-slate-50/30"
                >
                  {/* Card Header: Primary info + Status badge */}
                  <div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                    <div className="min-w-0 flex-1">
                      {nonActionColumns[0] && (
                        <div className="text-sm font-bold text-slate-900 leading-snug break-words">
                          {nonActionColumns[0].render
                            ? nonActionColumns[0].render(row[nonActionColumns[0].key], row, rowIndex)
                            : row[nonActionColumns[0].key]}
                        </div>
                      )}
                      {nonActionColumns[1] && nonActionColumns[1] !== statusColumn && (
                        <div className="mt-0.5 text-xs text-slate-500 font-medium break-words">
                          {nonActionColumns[1].render
                            ? nonActionColumns[1].render(row[nonActionColumns[1].key], row, rowIndex)
                            : row[nonActionColumns[1].key]}
                        </div>
                      )}
                    </div>
                    {statusRender && (
                      <div className="flex-shrink-0 pt-0.5">
                        {statusRender}
                      </div>
                    )}
                  </div>

                  {/* Card Body: 2-Column Clean Key-Value Grid */}
                  {detailColumns.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      {detailColumns.map((col, idx) => (
                        <div key={col.key || idx} className="space-y-0.5 min-w-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block truncate">
                            {col.label}
                          </span>
                          <div className="text-slate-800 font-semibold break-words leading-tight">
                            {col.render ? col.render(row[col.key], row, rowIndex) : (row[col.key] || '—')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card Actions: Full-width touch-friendly actions */}
                  {actionColumn && (
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap">
                      {actionColumn.render ? actionColumn.render(row[actionColumn.key], row, rowIndex) : row[actionColumn.key]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ================= DESKTOP TABLE VIEW (Strictly hidden md:block) ================= */}
          <div className="hidden md:block overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/95 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px] select-none sticky top-0 z-10 backdrop-blur-xs">
                  {columns.map((col, idx) => (
                    <th
                      key={col.key || idx}
                      className={`py-3.5 px-4 ${
                        col.sortable !== false ? 'cursor-pointer hover:bg-slate-100/90 transition-colors' : ''
                      } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                      style={{ width: col.width }}
                      onClick={() => handleSort(col.key, col.sortable !== false)}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 ${
                          col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                        }`}
                      >
                        <span>{col.label}</span>
                        {col.sortable !== false && (
                          <span className="text-slate-400">
                            {sortConfig.key === col.key ? (
                              sortConfig.direction === 'asc' ? (
                                <ChevronUp className="w-3.5 h-3.5 text-brand-600 stroke-[2.5]" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-brand-600 stroke-[2.5]" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-3 h-3 text-slate-300" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={row[keyField] || rowIndex}
                    className="hover:bg-brand-50/25 transition-colors group"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.key || colIndex}
                        className={`py-3.5 px-4 ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination Footer */}
      {!isLoading && totalRecords > 0 && (
        <div className="py-3.5 px-4 bg-slate-50/70 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
            <span>
              Showing{' '}
              <strong className="text-slate-900 font-bold">
                {Math.min((safePage - 1) * rowsPerPage + 1, totalRecords)}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-900 font-bold">
                {Math.min(safePage * rowsPerPage, totalRecords)}
              </strong>{' '}
              of <strong className="text-slate-900 font-bold">{totalRecords}</strong> records
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Per page:</span>
              <div className="w-20">
                <SearchableSelect
                  placement="top"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-xs shadow-2xs font-medium cursor-pointer"
                  searchPlaceholder="Rows..."
                  menuClassName="min-w-[90px]"
                >
                  {rowsPerPageOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </SearchableSelect>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-800 text-xs bg-white border border-slate-200 rounded-lg shadow-2xs">
              {safePage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
