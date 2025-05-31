import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  icon?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  icon = true,
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmButton: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500/50 text-white shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 active:scale-[0.98]',
          icon: 'text-red-600',
          iconBg: 'bg-gradient-to-br from-red-50 to-red-100'
        };
      case 'warning':
        return {
          confirmButton: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:ring-amber-500/50 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-[0.98]',
          icon: 'text-amber-600',
          iconBg: 'bg-gradient-to-br from-amber-50 to-orange-100'
        };
      default:
        return {
          confirmButton: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500/50 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-[0.98]',
          icon: 'text-blue-600',
          iconBg: 'bg-gradient-to-br from-blue-50 to-indigo-100'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-200 ease-out">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-6">
            {icon && (
              <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
                {title}
              </h2>
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <p className="text-gray-600 text-base leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 bg-gradient-to-r from-slate-100 to-gray-100 border border-slate-200/80 rounded-xl hover:from-slate-200 hover:to-gray-200 hover:border-slate-300/80 focus:outline-none focus:ring-4 focus:ring-slate-200/60 transition-all duration-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60 active:scale-[0.98]"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;