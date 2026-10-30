import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col space-y-2 pointer-events-none no-print">
      {toasts.map((toast) => {
        const getBg = () => {
          switch (toast.type) {
            case 'success':
              return 'bg-emerald-800 text-white border-emerald-700';
            case 'error':
              return 'bg-rose-800 text-white border-rose-700';
            case 'info':
            default:
              return 'bg-slate-900 text-white border-slate-800';
          }
        };

        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : Info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold max-w-sm animate-in slide-in-from-bottom-5 duration-200 ${getBg()}`}
          >
            <Icon className="w-4 h-4 shrink-0 text-amber-300" />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/60 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
