import React from 'react';

export const StatusBadge = ({ status, type = 'general' }) => {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

  // Status mappings
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200/80';
  let dotClass = 'bg-slate-400';
  let isPulse = false;

  if (
    normalized === 'active' ||
    normalized === 'completed' ||
    normalized === 'paid' ||
    normalized === 'finalized'
  ) {
    bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/90';
    dotClass = 'bg-emerald-500';
  } else if (
    normalized === 'waiting' ||
    normalized === 'checked-in'
  ) {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200/90';
    dotClass = 'bg-amber-500';
    isPulse = true;
  } else if (
    normalized === 'in consultation'
  ) {
    bgClass = 'bg-sky-50 text-sky-800 border-sky-200/90';
    dotClass = 'bg-sky-500';
    isPulse = true;
  } else if (
    normalized === 'partially paid' ||
    normalized === 'draft'
  ) {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200/90';
    dotClass = 'bg-amber-500';
  } else if (
    normalized === 'scheduled' ||
    normalized === 'routine'
  ) {
    bgClass = 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
    dotClass = 'bg-indigo-500';
  } else if (
    normalized === 'cancelled' ||
    normalized === 'inactive' ||
    normalized === 'no show' ||
    normalized === 'unpaid'
  ) {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200/90';
    dotClass = 'bg-rose-500';
  } else if (normalized === 'income') {
    bgClass = 'bg-teal-50 text-teal-700 border-teal-200/90';
    dotClass = 'bg-teal-500';
  } else if (normalized === 'expense') {
    bgClass = 'bg-purple-50 text-purple-700 border-purple-200/90';
    dotClass = 'bg-purple-500';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${bgClass} shadow-2xs whitespace-nowrap`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isPulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotClass} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotClass}`} />
      </span>
      {status}
    </span>
  );
};
