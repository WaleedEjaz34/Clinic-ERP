import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors min-h-[44px]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-white rounded-xl transition-colors min-h-[44px] shadow-sm ${
              type === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 shadow-rose-500/20'
                : 'bg-brand-600 hover:bg-brand-700 focus:ring-2 focus:ring-brand-500 shadow-brand-500/20'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-full flex-shrink-0 ${
            type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          {type === 'danger' ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <Info className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};
