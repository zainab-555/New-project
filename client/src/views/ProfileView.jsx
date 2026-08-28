import React, { useState } from 'react';
import { getApiBaseUrl, setApiBaseUrl, checkBackendHealth } from '../services/api';
import { storage } from '../services/storage';

export default function ProfileView({
  profile,
  onUpdateProfile,
  theme,
  toggleTheme,
  backendStatus,
  onRefreshBackend,
  onToast,
}) {
  const [formData, setFormData] = useState(profile || {});
  const [apiUrl, setApiUrlState] = useState(getApiBaseUrl());
  const [testingApi, setTestingApi] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    if (onToast) onToast('Profile settings saved successfully!', 'success');
  };

  const handleSaveApiUrl = async () => {
    setTestingApi(true);
    setApiBaseUrl(apiUrl);
    const health = await checkBackendHealth();
    setTestingApi(false);
    onRefreshBackend();
    if (health.online) {
      if (onToast) onToast(`Connected to API! ${health.database ? '(MongoDB Connected)' : '(No DB)'}`, 'success');
    } else {
      if (onToast) onToast('API unreachable at this URL. Running in offline fallback mode.', 'error');
    }
  };

  const handleExportData = () => {
    const data = storage.exportAllData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `campushub-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (onToast) onToast('Backup downloaded successfully!', 'success');
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const ok = storage.importAllData(parsed);
        if (ok) {
          if (onToast) onToast('Data imported successfully! Reloading...', 'success');
          setTimeout(() => window.location.reload(), 800);
        } else {
          if (onToast) onToast('Invalid backup file structure.', 'error');
        }
      } catch (err) {
        if (onToast) onToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data back to original demo seeds?')) {
      storage.resetAllData();
      if (onToast) onToast('Data reset to defaults. Reloading...', 'info');
      setTimeout(() => window.location.reload(), 600);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
          <i className="bi bi-gear-fill text-primary me-2" /> Student Settings & Preferences
        </h2>
        <p className="text-muted small">Manage your personal profile, theme, backend connection, and backups</p>
      </div>

      <div className="row g-4">
        {/* Left: Student Profile */}
        <div className="col-12 col-lg-7">
          <div className="glass-card">
            <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '800' }}>
              <i className="bi bi-person-badge text-primary me-2" /> Student Information
            </h3>

            <form onSubmit={handleSaveProfile}>
              <div className="row g-3">
                <div className="col-12 col-md-6 form-group-custom">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input-custom"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6 form-group-custom">
                  <label>Roll Number / Student ID</label>
                  <input
                    type="text"
                    required
                    className="form-input-custom"
                    value={formData.rollNo || ''}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  />
                </div>

                <div className="col-12 form-group-custom">
                  <label>College / University Name</label>
                  <input
                    type="text"
                    required
                    className="form-input-custom"
                    value={formData.college || ''}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6 form-group-custom">
                  <label>Branch / Department</label>
                  <input
                    type="text"
                    required
                    className="form-input-custom"
                    value={formData.branch || ''}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6 form-group-custom">
                  <label>Current Semester</label>
                  <select
                    className="form-input-custom"
                    value={formData.semester || '6th Semester'}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={`${s}th Semester`}>
                        {s}th Semester
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 form-group-custom">
                  <label>Attendance Target (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    className="form-input-custom"
                    value={formData.targetAttendance || 75}
                    onChange={(e) => setFormData({ ...formData, targetAttendance: Number(e.target.value) })}
                  />
                </div>

                <div className="col-12 col-md-6 form-group-custom">
                  <label>CGPA Goal Target</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5.0"
                    max="10.0"
                    className="form-input-custom"
                    value={formData.targetCgpa || 8.5}
                    onChange={(e) => setFormData({ ...formData, targetCgpa: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary-custom mt-3">
                <i className="bi bi-save" /> Save Profile Details
              </button>
            </form>
          </div>
        </div>

        {/* Right: Server API Config, Appearance & Backup */}
        <div className="col-12 col-lg-5 d-flex flex-column gap-4">
          {/* Appearance / Theme */}
          <div className="glass-card">
            <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '800' }}>
              <i className="bi bi-palette text-primary me-2" /> App Appearance
            </h3>
            <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-surface-elevated border">
              <div>
                <strong>Theme Mode</strong>
                <p className="small text-muted mb-0">
                  {theme === 'dark' ? 'Dark Glassmorphic Theme' : 'Clean Light Velvet Theme'}
                </p>
              </div>
              <button className="btn btn-outline-primary" onClick={toggleTheme}>
                <i className={`bi ${theme === 'dark' ? 'bi-sun-fill me-1 text-warning' : 'bi-moon-stars-fill me-1'}`} />
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>

          {/* Backend Connection */}
          <div className="glass-card">
            <h3 className="mb-2" style={{ fontSize: '16px', fontWeight: '800' }}>
              <i className="bi bi-hdd-network text-primary me-2" /> Backend Server Status
            </h3>
            <div className="mb-3">
              <div className={`p-2 rounded-2 small d-flex align-items-center gap-2 ${backendStatus.online ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                <i className={`bi ${backendStatus.online ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
                <span>
                  {backendStatus.online
                    ? `API Connected on ${apiUrl} ${backendStatus.database ? '(MongoDB Active)' : '(MongoDB offline)'}`
                    : 'Backend API is offline. Running with offline browser persistence.'}
                </span>
              </div>
            </div>

            <div className="form-group-custom">
              <label>API Base URL</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="http://localhost:5000"
                  value={apiUrl}
                  onChange={(e) => setApiUrlState(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={testingApi}
                  onClick={handleSaveApiUrl}
                >
                  {testingApi ? 'Connecting...' : 'Test & Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="glass-card">
            <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '800' }}>
              <i className="bi bi-cloud-arrow-down text-primary me-2" /> Data Backup & Reset
            </h3>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-secondary text-start" onClick={handleExportData}>
                <i className="bi bi-download me-2 text-primary" /> Export All Data (JSON)
              </button>

              <label className="btn btn-outline-secondary text-start mb-0 cursor-pointer">
                <i className="bi bi-upload me-2 text-primary" /> Restore Data from JSON
                <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
              </label>

              <button className="btn btn-outline-danger text-start mt-2" onClick={handleResetData}>
                <i className="bi bi-arrow-counterclockwise me-2" /> Reset Demo Seeds
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
