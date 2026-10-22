import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  subtitle,
  iconBg = 'bg-brand-50 text-brand-600',
  accentColor = 'border-slate-200/90',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl border ${accentColor} p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-brand-400 active:scale-[0.99]' : ''
      }`}
    >
      {/* Top subtle highlight shimmer on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/40 transition-all duration-300" />

      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
            {title}
          </span>
          {Icon && (
            <div className={`p-2 sm:p-2.5 rounded-xl ${iconBg} shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
          )}
        </div>

        <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {value}
          </span>
          {trend && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                trendType === 'positive'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                  : trendType === 'negative'
                  ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {trendType === 'positive' && <TrendingUp className="w-3 h-3 stroke-[2.5]" />}
              {trendType === 'negative' && <TrendingDown className="w-3 h-3 stroke-[2.5]" />}
              {trendType === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{trend}</span>
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <p className="mt-2 text-[11px] text-slate-500 font-medium truncate group-hover:text-slate-600 transition-colors">
          {subtitle}
        </p>
      )}
    </div>
  );
};
