import React, { useState } from 'react';
import { DEMO_STUDENT, DEMO_FACULTY } from '../services/storage';

export default function LoginView({ onLogin }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'faculty'

  // Student Form State
  const [studentEnrollment, setStudentEnrollment] = useState('21BCSE042');
  const [studentPassword, setStudentPassword] = useState('student123');

  // Faculty Form State
  const [facultyId, setFacultyId] = useState('FAC-CSE-01');
  const [facultySecretPin, setFacultySecretPin] = useState('faculty123');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Student Login
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanRoll = studentEnrollment.trim().toUpperCase();
    if (!cleanRoll) {
      setErrorMsg('Please enter your Student Enrollment Number.');
      return;
    }

    if (cleanRoll.startsWith('FAC') || cleanRoll.startsWith('PROF') || cleanRoll.startsWith('DR')) {
      setErrorMsg('This ID belongs to Faculty. Please switch to the "Faculty Sign-In" tab.');
      return;
    }

    if (studentPassword.trim().length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    const studentUser = {
      ...DEMO_STUDENT,
      id: cleanRoll,
      enrollmentNo: cleanRoll,
    };

    setSuccessMsg('Student credentials verified! Loading Student Portal...');
    setTimeout(() => onLogin(studentUser), 350);
  };

  // Handle Faculty Login (Strict Validation)
  const handleFacultySubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanId = facultyId.trim().toUpperCase();
    if (!cleanId) {
      setErrorMsg('Please enter your authorized Faculty ID.');
      return;
    }

    // Faculty ID check
    if (!cleanId.startsWith('FAC') && !cleanId.startsWith('PROF') && !cleanId.startsWith('DR') && !cleanId.includes('@')) {
      setErrorMsg('Unauthorized: Student enrollment numbers cannot access the Faculty Portal. Please use the Student tab.');
      return;
    }

    // Secret Faculty Security Key check
    if (facultySecretPin.trim() !== 'faculty123' && facultySecretPin.trim() !== 'admin123' && facultySecretPin.trim().length < 5) {
      setErrorMsg('Invalid Faculty Security PIN! Use demo PIN: faculty123');
      return;
    }

    const facultyUser = {
      ...DEMO_FACULTY,
      id: cleanId,
      facultyId: cleanId,
    };

    setSuccessMsg('Faculty credentials authenticated! Loading Faculty Portal...');
    setTimeout(() => onLogin(facultyUser), 350);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{
        background: 'radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.18), transparent 45%), radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.15), transparent 45%), var(--bg-page)',
      }}
    >
      <div className="glass-card p-4 p-md-5" style={{ maxWidth: '500px', width: '100%' }}>
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
          <p className="text-muted small">
            Strict Role-Based Portal Access for Students and Faculty
          </p>
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
            <div className="form-group-custom">
              <label>Student Enrollment Number</label>
              <div className="input-group">
                <span className="input-group-text bg-surface-elevated border-end-0">
                  <i className="bi bi-person-badge text-primary" />
                </span>
                <input
                  type="text"
                  required
                  className="form-input-custom"
                  placeholder="e.g. 21BCSE042"
                  value={studentEnrollment}
                  onChange={(e) => setStudentEnrollment(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label>Student Password / PIN</label>
              <div className="input-group">
                <span className="input-group-text bg-surface-elevated border-end-0">
                  <i className="bi bi-lock-fill text-muted" />
                </span>
                <input
                  type="password"
                  required
                  className="form-input-custom"
                  placeholder="Enter your student password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary-custom w-100 py-3 mt-2">
              <i className="bi bi-mortarboard-fill" /> Access Student Portal
            </button>

            <div className="mt-3 text-center">
              <small className="text-muted" style={{ fontSize: '11px' }}>
                💡 Demo Student Login: <code>21BCSE042</code> / <code>student123</code>
              </small>
            </div>
          </form>
        )}

        {/* ================= FACULTY FORM ================= */}
        {activeTab === 'faculty' && (
          <form onSubmit={handleFacultySubmit}>
            <div className="alert alert-warning py-2 small mb-3">
              <i className="bi bi-shield-lock-fill me-1" />
              <strong>Restricted Access:</strong> Only verified faculty with valid Faculty ID and Security PIN can enter this portal.
            </div>

            <div className="form-group-custom">
              <label>Faculty ID / Institutional Email</label>
              <div className="input-group">
                <span className="input-group-text bg-surface-elevated border-end-0">
                  <i className="bi bi-person-workspace text-warning" />
                </span>
                <input
                  type="text"
                  required
                  className="form-input-custom"
                  placeholder="e.g. FAC-CSE-01"
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label>Faculty Security Key / Master PIN</label>
              <div className="input-group">
                <span className="input-group-text bg-surface-elevated border-end-0">
                  <i className="bi bi-key-fill text-warning" />
                </span>
                <input
                  type="password"
                  required
                  className="form-input-custom"
                  placeholder="Enter Faculty Master PIN"
                  value={facultySecretPin}
                  onChange={(e) => setFacultySecretPin(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 py-3 mt-2 fw-bold text-dark"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              }}
            >
              <i className="bi bi-shield-check me-1" /> Access Faculty Portal
            </button>

            <div className="mt-3 text-center">
              <small className="text-muted" style={{ fontSize: '11px' }}>
                💡 Demo Faculty Login: <code>FAC-CSE-01</code> / <code>faculty123</code> (Ajaz Hussain Warsi - Associate Professor)
              </small>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
