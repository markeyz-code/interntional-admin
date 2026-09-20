import { useState } from '#app';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export const useCustomToast = () => {
  const toasts = useState<Toast[]>('admin-toasts', () => []);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts.value.push({ ...toast, id });
    setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id); }, 4000);
  };

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, showToast, removeToast };
};
