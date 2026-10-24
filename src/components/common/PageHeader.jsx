import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  children,
}) => {
  const headerActions = actions || children;
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-5">
      <div>
        {/* Breadcrumb path */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium flex-wrap">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
              title="Dashboard Home"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-brand-600 transition-colors hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-800 font-semibold bg-slate-100/80 px-2 py-0.5 rounded-md text-[11px]">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action buttons */}
      {headerActions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {headerActions}
        </div>
      )}
    </div>
  );
};
