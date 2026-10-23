import React from 'react';
import { CheckCircle2, Clock, Archive, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const ContentStatusBadge = ({ status, size = 'sm' }) => {
  const norm = String(status || '').toLowerCase().trim();

  let config = {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: Clock,
    label: status || 'Unknown',
  };

  if (norm === 'published' || norm === 'active' || norm === 'live') {
    config = {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      icon: CheckCircle2,
      label: norm === 'active' ? 'Active' : 'Published',
    };
  } else if (norm === 'draft' || norm === 'pending') {
    config = {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      icon: Clock,
      label: 'Draft',
    };
  } else if (norm === 'archived' || norm === 'inactive' || norm === 'hidden') {
    config = {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: norm === 'hidden' ? EyeOff : Archive,
      label: norm === 'inactive' ? 'Inactive' : norm === 'hidden' ? 'Hidden' : 'Archived',
    };
  }

  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border shadow-2xs ${config.bg} ${config.text} ${config.border} ${
        isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
