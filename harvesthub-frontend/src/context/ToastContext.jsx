import {
  useCallback,
  useMemo
} from 'react';
import toast from 'react-hot-toast';
import { ToastContext } from './ToastContextValue.js';

export const ToastProvider = ({ children }) => {
  const success = useCallback((message) => {
    toast.success(message);
  }, []);

  const error = useCallback((message) => {
    toast.error(message);
  }, []);

  const info = useCallback((message) => {
    toast(message, {
      icon: 'ℹ️'
    });
  }, []);

  const value = useMemo(
    () => ({
      success,
      error,
      info
    }),
    [success, error, info]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};