import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, durationMs = 2000 }) {
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => onClose?.(), durationMs);
    return () => clearTimeout(timeout);
  }, [message, durationMs, onClose]);

  if (!message) return null;

  const baseClasses =
    'fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm max-w-[90vw]';

  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200',
    info: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200',
  };

  return (
    <div className={`${baseClasses} ${variants[type] || variants.info}`} role="status">
      <div className="flex items-center gap-3">
        <span className="flex-1">{message}</span>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="text-xs opacity-80 hover:opacity-100"
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  );
}
