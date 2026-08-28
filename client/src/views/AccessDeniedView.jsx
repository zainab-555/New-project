import React from 'react';

export default function AccessDeniedView({ requiredRole = 'Faculty', onGoBack, onLogout }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div
        className="rounded-circle p-4 mb-3 d-grid place-items-center"
        style={{
          width: '90px',
          height: '90px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          fontSize: '40px',
        }}
      >
        <i className="bi bi-shield-lock-fill" />
      </div>

      <span className="badge bg-danger mb-2 font-monospace px-3 py-1" style={{ letterSpacing: '1px' }}>
        403 ACCESS FORBIDDEN
      </span>

      <h2 style={{ fontSize: '24px', fontWeight: '900' }} className="mb-2">
        {requiredRole} Authorization Required
      </h2>

      <p className="text-muted small mb-4" style={{ maxWidth: '480px' }}>
        This module is restricted strictly to <strong>{requiredRole} Members</strong>. You do not have permission to access attendance rosters, grading vaults, or faculty administrative controls with your current role.
      </p>

      <div className="d-flex gap-3">
        <button className="btn btn-secondary-custom" onClick={onGoBack}>
          <i className="bi bi-arrow-left me-1" /> Return to My Dashboard
        </button>

        <button className="btn btn-outline-danger btn-sm px-3" onClick={onLogout}>
          <i className="bi bi-box-arrow-right me-1" /> Login with {requiredRole} Account
        </button>
      </div>
    </div>
  );
}
