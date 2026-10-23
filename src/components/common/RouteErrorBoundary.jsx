import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, RotateCcw, Home, Activity } from 'lucide-react';

export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const errorMessage =
    error?.statusText || error?.message || 'An unexpected error occurred while loading this page.';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 text-center space-y-5">
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
            Application Error
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
            Something went wrong
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            MedPulse ERP encountered an unexpected issue while rendering this view.
          </p>
        </div>

        {/* Error Detail Box */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Error Details
          </p>
          <p className="text-xs font-mono text-rose-700 font-semibold break-words">
            {errorMessage}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/');
              window.location.reload();
            }}
            className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:shadow-glow cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
