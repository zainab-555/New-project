import React, { useState } from 'react';
import { DEMO_STUDENT, DEMO_FACULTY } from '../services/storage';

export default function LoginView({ onLogin }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'faculty'

  // Student Form State (Prefilled with Demo Email & Password)
  const [studentEmail, setStudentEmail] = useState('student@campus.edu');
  const [studentPassword, setStudentPassword] = useState('student123');

  // Faculty Form State (Prefilled with Demo Email & Password)
  const [facultyEmail, setFacultyEmail] = useState('faculty@campus.edu');
  const [facultySecretPin, setFacultySecretPin] = useState('faculty123');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1-Click Instant Demo Login Helpers
  const handleQuickStudentLogin = () => {
    setErrorMsg('');
    setSuccessMsg('Logging in as Demo Student (Aman Sharma)...');
    setTimeout(() => {
      onLogin({
        ...DEMO_STUDENT,
        email: 'student@campus.edu',
      });
    }, 250);
  };

  const handleQuickFacultyLogin = () => {
    setErrorMsg('');
    setSuccessMsg('Logging in as Demo Faculty (Prof. Ajaz Hussain Warsi)...');
    setTimeout(() => {
      onLogin({
        ...DEMO_FACULTY,
        email: 'faculty@campus.edu',
      });
    }, 250);
  };

  // Handle Student Login Submit
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const input = studentEmail.trim();
    if (!input) {
      setErrorMsg('Please enter your Student Email or Enrollment ID.');
      return;
    }

    if (studentPassword.trim().length < 3) {
      setErrorMsg('Password must be at least 3 characters long.');
      return;
    }

    const cleanInput = input.toUpperCase();
    if (cleanInput.startsWith('FAC') || cleanInput.startsWith('PROF') || cleanInput.startsWith('DR-')) {
      setErrorMsg('This ID belongs to Faculty. Please switch to the "Faculty Sign-In" tab.');
      return;
    }

    const studentUser = {
      ...DEMO_STUDENT,
      id: input.includes('@') ? '21BCSE042' : cleanInput,
      enrollmentNo: input.includes('@') ? '21BCSE042' : cleanInput,
      email: input.includes('@') ? input.toLowerCase() : 'student@campus.edu',
    };

    setSuccessMsg('Student credentials verified! Loading Student Portal...');
    setTimeout(() => onLogin(studentUser), 300);
  };

  // Handle Faculty Login Submit
  const handleFacultySubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const input = facultyEmail.trim();
    if (!input) {
      setErrorMsg('Please enter your Faculty Institutional Email or ID.');
      return;
    }

    if (facultySecretPin.trim().length < 3) {
      setErrorMsg('Security PIN / Password must be at least 3 characters.');
      return;
    }

    const facultyUser = {
      ...DEMO_FACULTY,
      id: input.includes('@') ? 'FAC-CSE-01' : input.toUpperCase(),
      facultyId: input.includes('@') ? 'FAC-CSE-01' : input.toUpperCase(),
      email: input.includes('@') ? input.toLowerCase() : 'faculty@campus.edu',
    };

    setSuccessMsg('Faculty credentials authenticated! Loading Faculty Portal...');
    setTimeout(() => onLogin(facultyUser), 300);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{
        background: 'radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.18), transparent 45%), radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.15), transparent 45%), var(--bg-page)',
      }}
    >
      <div className="glass-card p-4 p-md-5" style={{ maxWidth: '520px', width: '100%' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="logo-icon mx-auto mb-3"
            style={{ width: '58px', height: '58px', fontSize: '28px' }}
          >
            <i className="bi bi-mortarboard-fill" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            CampusHub Security Gateway
          </h2>
          <p className="text-muted small mb-3">
            Role-Based Portal Access for Students and Faculty
          </p>

          {/* Quick 1-Click Access Buttons */}
          <div className="p-3 rounded-3 bg-surface-elevated border text-start mb-2">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small fw-bold text-muted">⚡ 1-Click Instant Demo Login:</span>
              <span className="badge bg-success-subtle text-success border border-success-subtle">Ready</span>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                id="btn-quick-student-login"
                className="btn btn-sm btn-outline-primary flex-1 d-flex align-items-center justify-content-center gap-1 py-2 fw-semibold"
                onClick={handleQuickStudentLogin}
              >
                <i className="bi bi-person-fill" /> Student Demo
              </button>
              <button
                type="button"
                id="btn-quick-faculty-login"
                className="btn btn-sm btn-outline-warning flex-1 d-flex align-items-center justify-content-center gap-1 py-2 fw-semibold text-dark"
                onClick={handleQuickFacultyLogin}
              >
                <i className="bi bi-person-workspace" /> Faculty Demo
              </button>
            </div>
          </div>
        </div>

        {/* Role Selection Tabs */}
        <div className="d-flex p-1 rounded-3 bg-surface-elevated border mb-4">
          <button
            type="button"
            className={`btn btn-sm flex-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 ${
              activeTab === 'student' ? 'btn-primary shadow-sm' : 'text-muted'
            }`}
            onClick={() => {
              setActiveTab('student');
              setErrorMsg('');
            }}
          >
            <i className="bi bi-mortarboard" />
            <span>Student Sign-In</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm flex-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 ${
              activeTab === 'faculty' ? 'btn-warning text-dark shadow-sm' : 'text-muted'
            }`}
            onClick={() => {
              setActiveTab('faculty');
              setErrorMsg('');
            }}
          >
            <i className="bi bi-person-workspace" />
            <span>Faculty Sign-In</span>
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="alert alert-danger py-2 small mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-shield-x text-danger fs-6" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success py-2 small mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-shield-check text-success fs-6" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= STUDENT FORM ================= */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit}>
            <div className="form-group-custom mb-3">
              <label className="fw-semibold small mb-1">Student Email or Enrollment Number</label>
              <div className="input-group">
                <span className="input-group-text bg-surface-elevated border-end-0">
                  <i className="bi bi-envelope-fill text-primary" />
                </span>
                <input
                  type="text"
                  required
                  id="student-email-input"
                  className="form-input-custom form-control"
                  placeholder="student@campus.edu or 21BCSE042"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-custom mb-3">
              <label className="fw-semibold small mb-1">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-surface-elevated border-end-0">
                  <i className="bi bi-lock-fill text-muted" />
                </span>
                <input
                  type="password"
                  required
                  id="student-password-input"
                  className="form-input-custom form-control"
                  placeholder="Enter password (e.g. student123)"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" id="btn-submit-student" className="btn-primary-custom w-100 py-3 mt-2">
              <i className="bi bi-mortarboard-fill me-2" /> Sign In as Student
            </button>

            <div className="mt-3 p-2 rounded bg-surface-elevated border text-center">
              <span className="text-muted small" style={{ fontSize: '12px' }}>
                💡 <strong>Demo Credentials:</strong> Email: <code>student@campus.edu</code> | Pass: <code>student123</code>
              </span>
            </div>
          </form>
        )}

        {/* ================= FACULTY FORM ================= */}
        {activeTab === 'faculty' && (
          <form onSubmit={handleFacultySubmit}>
            <div className="alert alert-warning py-2 small mb-3">
              <i className="bi bi-shield-lock-fill me-1" />
              <strong>Faculty Portal:</strong> Login with demo faculty email and password.
            </div>

            <div className="form-group-custom mb-3">
              <label className="fw-semibold small mb-1">Faculty Email or Faculty ID</label>
              <div className="input-group">
                <span className="input-group-text bg-surface-elevated border-end-0">
                  <i className="bi bi-envelope-fill text-warning" />
                </span>
                <input
                  type="text"
                  required
                  id="faculty-email-input"
                  className="form-input-custom form-control"
                  placeholder="faculty@campus.edu or FAC-CSE-01"
                  value={facultyEmail}
                  onChange={(e) => setFacultyEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-custom mb-3">
              <label className="fw-semibold small mb-1">Password / Security PIN</label>
              <div className="input-group">
                <span className="input-group-text bg-surface-elevated border-end-0">
                  <i className="bi bi-key-fill text-warning" />
                </span>
                <input
                  type="password"
                  required
                  id="faculty-password-input"
                  className="form-input-custom form-control"
                  placeholder="Enter PIN / password (e.g. faculty123)"
                  value={facultySecretPin}
                  onChange={(e) => setFacultySecretPin(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-faculty"
              className="btn w-100 py-3 mt-2 fw-bold text-dark"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              }}
            >
              <i className="bi bi-shield-check me-2" /> Sign In as Faculty
            </button>

            <div className="mt-3 p-2 rounded bg-surface-elevated border text-center">
              <span className="text-muted small" style={{ fontSize: '12px' }}>
                💡 <strong>Demo Credentials:</strong> Email: <code>faculty@campus.edu</code> | Pass: <code>faculty123</code>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
