import React from 'react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container-custom">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item ${toast.type || 'info'}`}
          onClick={() => onDismiss(toast.id)}
          style={{ cursor: 'pointer' }}
        >
          <i
            className={`bi ${
              toast.type === 'success'
                ? 'bi-check-circle-fill'
                : toast.type === 'error'
                ? 'bi-exclamation-triangle-fill'
                : 'bi-info-circle-fill'
            }`}
          />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
