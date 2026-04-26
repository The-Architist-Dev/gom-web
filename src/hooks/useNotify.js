import { useCallback, useState } from 'react';

/**
 * useNotify — toast notification queue.
 * Returns: { toasts, notify, dismiss }
 */
export function useNotify() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'info', duration = 4500) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  return { toasts, notify, dismiss };
}

