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
import { formatCurrency } from '../../utils/currency';

/**
 * Determine if a column represents a numeric/value column where a total is meaningful.
 * Strictly excludes non-value columns: IDs, Names, Dates, Statuses, Types, Actions, Contacts, etc.
 */
export const isValueColumn = (col) => {
  if (typeof col.hasTotal === 'boolean') {
    return col.hasTotal;
  }
  const key = (col.key || col.accessor || '').toLowerCase();
  const label = (col.label || col.header || '').toLowerCase();

  // Explicit non-value keys/labels that MUST NEVER be totaled
  const nonValueTerms = [
    'id', 'accountid', 'patientid', 'doctorid', 'billnumber', 'receiptnumber',
    'vouchernumber', 'date', 'time', 'patientname', 'patient', 'doctorname',
    'doctor', 'accountname', 'account', 'categoryname', 'category', 'type',
    'status', 'actions', 'action', 'phone', 'email', 'address', 'gender',
    'age', 'instructions', 'reason', 'notes', 'diagnosis', 'code', 'shortcode',
    'role', 'avatar', 'visit', 'name', 'schedule', 'password'
  ];

  if (
    nonValueTerms.some(
      (term) => key === term || key.endsWith('id') || key.endsWith('number') || key.endsWith('date') || key.endsWith('name')
    )
  ) {
    return false;
  }

  // Meaningful numeric value keys/labels
  const valueTerms = [
    'totalamount', 'paidamount', 'balancedue', 'amount', 'currentbalance',
    'openingbalance', 'outstandingbalance', 'inflow', 'outflow', 'revenue',
    'expense', 'quantity', 'billed', 'collected'
  ];

  return valueTerms.some((term) => key.includes(term) || label.includes(term));
};

export const DataTable = ({
  columns,
  data = [],
  keyField = 'id',
  isLoading = false,
  emptyMessage = 'No records found matching your filters.',
  emptyAction,
  rowsPerPageOptions = [5, 10, 20, 50],
  defaultRowsPerPage = 10,
  showTotals = true,
  totalRowLabel = 'Total',
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
  const actionColumn = columns.find((c) => {
    const k = (c.key || c.accessor || '').toLowerCase();
    const l = (c.label || c.header || '').toLowerCase();
    return k.includes('action') || l.includes('action');
  });
  const statusColumn = columns.find((c) => {
    const k = (c.key || c.accessor || '').toLowerCase();
    return k.includes('status');
  });
  const nonActionColumns = columns.filter((c) => c !== actionColumn);

  // Totals Calculation over ALL currently filtered/searched data
  const totalsMap = useMemo(() => {
    if (!showTotals || !data || data.length === 0) return null;

    const valueColumns = columns.filter((col) => isValueColumn(col));
    if (valueColumns.length === 0) return null;

    const map = {};
    columns.forEach((col) => {
      const colKey = col.key || col.accessor;
      if (!colKey || !isValueColumn(col)) {
        map[colKey] = null;
        return;
      }

      if (typeof col.totalCalculation === 'function') {
        map[colKey] = col.totalCalculation(data, colKey);
      } else {
        const sum = data.reduce((acc, row) => {
          const raw = row[colKey];
          const num = typeof raw === 'number' ? raw : parseFloat(raw);
          return acc + (isNaN(num) ? 0 : num);
        }, 0);
        map[colKey] = sum;
      }
    });

    return map;
  }, [columns, data, showTotals]);

  // Render formatted total for a value column
  const renderTotalValue = (col, totalVal) => {
    if (totalVal === null || totalVal === undefined) return null;

    if (typeof col.totalFormatter === 'function') {
      return col.totalFormatter(totalVal, data);
    }
    if (typeof col.renderTotal === 'function') {
      return col.renderTotal(totalVal, data);
    }

    const colKey = (col.key || col.accessor || '').toLowerCase();
    const colLabel = (col.label || col.header || '').toLowerCase();
    const isCurrency =
      colKey.includes('amount') ||
      colKey.includes('balance') ||
      colKey.includes('fee') ||
      colKey.includes('charges') ||
      colKey.includes('inflow') ||
      colKey.includes('outflow') ||
      colKey.includes('price') ||
      colKey.includes('cost') ||
      colKey.includes('revenue') ||
      colKey.includes('expense') ||
      colLabel.includes('amount') ||
      colLabel.includes('balance') ||
      colLabel.includes('paid') ||
      colLabel.includes('due') ||
      colLabel.includes('expense') ||
      colLabel.includes('revenue');

    if (isCurrency) {
      return <span className="font-extrabold tabular-nums">{formatCurrency(totalVal)}</span>;
    }

    return <span className="font-extrabold tabular-nums">{Number(totalVal).toLocaleString('en-US')}</span>;
  };

  const firstNonValueColIndex = columns.findIndex((col) => !isValueColumn(col));

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
              const statusColKey = statusColumn ? (statusColumn.key || statusColumn.accessor) : null;
              const statusRender = statusColumn
                ? statusColumn.render
                  ? statusColumn.render(row[statusColKey], row, rowIndex)
                  : row[statusColKey]
                : null;

              // Remaining detail columns excluding primary (idx 0), secondary (idx 1), and status
              const detailColumns = nonActionColumns.slice(1).filter((c) => c !== statusColumn);
              const primaryColKey = nonActionColumns[0] ? (nonActionColumns[0].key || nonActionColumns[0].accessor) : null;
              const secondaryColKey = nonActionColumns[1] ? (nonActionColumns[1].key || nonActionColumns[1].accessor) : null;

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
                            ? nonActionColumns[0].render(row[primaryColKey], row, rowIndex)
                            : row[primaryColKey]}
                        </div>
                      )}
                      {nonActionColumns[1] && nonActionColumns[1] !== statusColumn && (
                        <div className="mt-0.5 text-xs text-slate-500 font-medium break-words">
                          {nonActionColumns[1].render
                            ? nonActionColumns[1].render(row[secondaryColKey], row, rowIndex)
                            : row[secondaryColKey]}
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
                      {detailColumns.map((col, idx) => {
                        const colKey = col.key || col.accessor;
                        return (
                          <div key={colKey || idx} className="space-y-0.5 min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block truncate">
                              {col.label || col.header}
                            </span>
                            <div className="text-slate-800 font-semibold break-words leading-tight">
                              {col.render ? col.render(row[colKey], row, rowIndex) : (row[colKey] || '—')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Card Actions: Full-width touch-friendly actions */}
                  {actionColumn && (
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap">
                      {actionColumn.render
                        ? actionColumn.render(row[actionColumn.key || actionColumn.accessor], row, rowIndex)
                        : row[actionColumn.key || actionColumn.accessor]}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile Dynamic Totals Summary Card */}
            {totalsMap && (
              <div className="bg-slate-100/90 border-2 border-slate-300/90 rounded-2xl p-4 shadow-sm space-y-3 mt-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                      Totals Summary
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono">
                      {totalRecords} {totalRecords === 1 ? 'Record' : 'Records'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Filtered Dataset</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {columns.filter(isValueColumn).map((col) => {
                    const colKey = col.key || col.accessor;
                    const totalVal = totalsMap[colKey];
                    return (
                      <div key={colKey} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block truncate">
                          {col.label || col.header} Total
                        </span>
                        <div className="text-sm font-extrabold text-slate-900">
                          {renderTotalValue(col, totalVal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ================= DESKTOP TABLE VIEW (Strictly hidden md:block) ================= */}
          <div className="hidden md:block overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/95 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px] select-none sticky top-0 z-10 backdrop-blur-xs">
                  {columns.map((col, idx) => {
                    const colKey = col.key || col.accessor;
                    return (
                      <th
                        key={colKey || idx}
                        className={`py-3.5 px-4 ${
                          col.sortable !== false ? 'cursor-pointer hover:bg-slate-100/90 transition-colors' : ''
                        } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                        style={{ width: col.width }}
                        onClick={() => handleSort(colKey, col.sortable !== false)}
                      >
                        <div
                          className={`inline-flex items-center gap-1.5 ${
                            col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                          }`}
                        >
                          <span>{col.label || col.header}</span>
                          {col.sortable !== false && (
                            <span className="text-slate-400">
                              {sortConfig.key === colKey ? (
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
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={row[keyField] || rowIndex}
                    className="hover:bg-brand-50/25 transition-colors group"
                  >
                    {columns.map((col, colIndex) => {
                      const colKey = col.key || col.accessor;
                      return (
                        <td
                          key={colKey || colIndex}
                          className={`py-3.5 px-4 ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          }`}
                        >
                          {col.render ? col.render(row[colKey], row, rowIndex) : row[colKey]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>

              {/* Dynamic Totals Table Footer (Reflects Filtered Records) */}
              {totalsMap && (
                <tfoot className="bg-slate-100/95 border-t-2 border-slate-300/90 font-bold text-slate-900 select-none">
                  <tr>
                    {columns.map((col, colIndex) => {
                      const colKey = col.key || col.accessor;
                      const isVal = isValueColumn(col);
                      const isPrimaryLabel = colIndex === (firstNonValueColIndex >= 0 ? firstNonValueColIndex : 0);

                      return (
                        <td
                          key={colKey || colIndex}
                          className={`py-3.5 px-4 ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          }`}
                        >
                          {isVal ? (
                            renderTotalValue(col, totalsMap[colKey])
                          ) : isPrimaryLabel ? (
                            <div
                              className={`inline-flex items-center gap-2 ${
                                col.align === 'right'
                                  ? 'justify-end'
                                  : col.align === 'center'
                                  ? 'justify-center'
                                  : 'justify-start'
                              }`}
                            >
                              <span className="font-black uppercase tracking-wider text-xs text-slate-900">
                                {totalRowLabel}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-200/90 text-slate-700 text-[10px] font-bold font-mono">
                                {totalRecords} {totalRecords === 1 ? 'Record' : 'Records'}
                              </span>
                            </div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              )}
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
