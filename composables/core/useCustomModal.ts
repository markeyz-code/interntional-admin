import { useState } from '#app';

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  isConfirm: boolean;
  resolve?: (value: boolean) => void;
}

export const useCustomModal = () => {
  const modalState = useState<ModalState>('custom_modal_state', () => ({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    isConfirm: false,
  }));

  const confirm = (options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      modalState.value = {
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        type: options.type || 'info',
        isConfirm: true,
        resolve,
      };
    });
  };

  const alert = (
    options:
      | {
          title?: string;
          message: string;
          confirmText?: string;
          type?: 'info' | 'warning' | 'danger' | 'success';
        }
      | string,
  ): Promise<boolean> => {
    const opts = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      modalState.value = {
        isOpen: true,
        title: opts.title || 'Notice',
        message: opts.message,
        confirmText: opts.confirmText || 'Got it',
        cancelText: '',
        type: opts.type || 'info',
        isConfirm: false,
        resolve,
      };
    });
  };

  const onConfirm = () => {
    if (modalState.value.resolve) {
      modalState.value.resolve(true);
    }
    modalState.value.isOpen = false;
  };

  const onCancel = () => {
    if (modalState.value.resolve) {
      modalState.value.resolve(false);
    }
    modalState.value.isOpen = false;
  };

  return {
    modalState,
    confirm,
    alert,
    onConfirm,
    onCancel,
  };
};
