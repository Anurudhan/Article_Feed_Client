export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  dismissible?: boolean;
}

export interface ToastContextType {
  showToast: (message: string, type: ToastType, options?: Partial<ToastMessage>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}
