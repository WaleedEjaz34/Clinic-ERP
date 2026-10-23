import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Globe, ExternalLink } from 'lucide-react';

export const CMSPageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  badge,
}) => {
  return (
    <div className="pb-4 border-b border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1 min-w-0">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium overflow-x-auto no-scrollbar">
          <NavLink
            to="/website-cms"
            className="flex items-center gap-1 text-slate-500 hover:text-brand-600 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-brand-600" />
            <span>Website CMS</span>
          </NavLink>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              {crumb.path ? (
                <NavLink
                  to={crumb.path}
                  className="text-slate-500 hover:text-brand-600 transition-colors whitespace-nowrap"
                >
                  {crumb.label}
                </NavLink>
              ) : (
                <span className="text-slate-800 font-semibold whitespace-nowrap">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Title & Badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
          {actions}
        </div>
      )}
    </div>
  );
};
