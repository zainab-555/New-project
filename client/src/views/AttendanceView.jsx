import React, { useState } from 'react';

export default function AttendanceView({
  attendance = [],
  onUpdateAttendance,
  profile,
  onUpdateTarget,
}) {
  const [target, setTarget] = useState(profile?.targetAttendance || 75);
  const [newSubj, setNewSubj] = useState({ subject: '', code: '', attended: 20, total: 25, instructor: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Overall attendance calculation
  const totalAttended = attendance.reduce((sum, item) => sum + (item.attended || 0), 0);
  const totalHeld = attendance.reduce((sum, item) => sum + (item.total || 0), 0);
  const overallPercent = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 100;

  // Safe Bunks for individual subject
  const calculateSubjectBunk = (att, tot) => {
    const targetRatio = target / 100;
    if (tot === 0) return { safe: true, count: 0 };

    const safeBunks = Math.floor(att / targetRatio - tot);
    if (safeBunks >= 0) {
      return { safe: true, count: safeBunks };
    } else {
      const need = Math.ceil((targetRatio * tot - att) / (1 - targetRatio));
      return { safe: false, count: need > 0 ? need : 0 };
    }
  };

  const handleMark = (id, type) => {
    const updated = attendance.map((item) => {
      if (item.id === id) {
        if (type === 'present') {
          return { ...item, attended: item.attended + 1, total: item.total + 1 };
        } else if (type === 'absent') {
          return { ...item, total: item.total + 1 };
        } else if (type === 'undo') {
          if (item.total > 0 && item.attended > 0) {
            return { ...item, attended: item.attended - 1, total: item.total - 1 };
          }
        }
      }
      return item;
    });
    onUpdateAttendance(updated);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubj.subject || !newSubj.code) return;
    const newEntry = {
      id: `att-${Date.now()}`,
      subject: newSubj.subject,
      code: newSubj.code,
      attended: Number(newSubj.attended) || 0,
      total: Number(newSubj.total) || 1,
      instructor: newSubj.instructor,
      color: '#6366f1',
    };
    onUpdateAttendance([...attendance, newEntry]);
    setNewSubj({ subject: '', code: '', attended: 20, total: 25, instructor: '' });
    setShowAddForm(false);
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm('Are you sure you want to remove this subject from attendance tracking?')) {
      onUpdateAttendance(attendance.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header & Target Slider */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-pie-chart-fill text-primary me-2" /> Attendance & Bunk-O-Meter
          </h2>
          <p className="text-muted small">Stay safely above minimum criteria and plan your bunks stress-free</p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2 p-2 rounded-3 border bg-surface-elevated">
            <span className="small font-weight-bold">Target:</span>
            <select
              className="form-select form-select-sm"
              style={{ width: '90px' }}
              value={target}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTarget(val);
                if (onUpdateTarget) onUpdateTarget(val);
              }}
            >
              <option value={75}>75% (Standard)</option>
              <option value={80}>80% (Strict)</option>
              <option value={85}>85% (High)</option>
              <option value={65}>65% (Relaxed)</option>
            </select>
          </div>

          <button className="btn-primary-custom py-2 px-3" onClick={() => setShowAddForm(true)}>
            <i className="bi bi-plus-lg" /> Add Subject
          </button>
        </div>
      </div>

      {/* Overall Attendance Card */}
      <div className="glass-card">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-4 text-center">
            <div
              className="display-4 fw-bold"
              style={{ color: overallPercent >= target ? '#10b981' : '#f43f5e' }}
            >
              {overallPercent}%
            </div>
            <div className="text-muted small">
              Overall Attended: {totalAttended} / {totalHeld} Lectures
            </div>
            <span className={`badge mt-2 ${overallPercent >= target ? 'bg-success' : 'bg-danger'}`}>
              {overallPercent >= target ? 'Safe Zone' : 'Shortage Warning'}
            </span>
          </div>

          <div className="col-12 col-md-8 border-start-md ps-md-4">
            <h4 style={{ fontSize: '16px', fontWeight: '800' }}>College Attendance Criteria</h4>
            <p className="text-muted small mb-3">
              Your required target is <strong>{target}%</strong>. If overall or subject attendance dips below this, you may be detained from semester end exams.
            </p>
            <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
              <div
                className={`progress-bar ${overallPercent >= target ? 'bg-success' : 'bg-danger'}`}
                style={{ width: `${Math.min(overallPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Subject Modal / Form */}
      {showAddForm && (
        <div className="glass-card p-4 border-primary">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="m-0 font-weight-bold" style={{ fontSize: '16px' }}>
              <i className="bi bi-journal-plus text-primary me-2" /> Add Subject for Attendance
            </h4>
            <button className="btn-close" onClick={() => setShowAddForm(false)} />
          </div>
          <form onSubmit={handleAddSubject}>
            <div className="row g-2">
              <div className="col-12 col-md-4 form-group-custom">
                <label>Subject Name</label>
                <input
                  type="text"
                  required
                  className="form-input-custom"
                  placeholder="e.g. Operating Systems"
                  value={newSubj.subject}
                  onChange={(e) => setNewSubj({ ...newSubj, subject: e.target.value })}
                />
              </div>
              <div className="col-6 col-md-2 form-group-custom">
                <label>Code</label>
                <input
                  type="text"
                  required
                  className="form-input-custom"
                  placeholder="CSE-304"
                  value={newSubj.code}
                  onChange={(e) => setNewSubj({ ...newSubj, code: e.target.value })}
                />
              </div>
              <div className="col-6 col-md-2 form-group-custom">
                <label>Attended</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-input-custom"
                  value={newSubj.attended}
                  onChange={(e) => setNewSubj({ ...newSubj, attended: e.target.value })}
                />
              </div>
              <div className="col-6 col-md-2 form-group-custom">
                <label>Total Held</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="form-input-custom"
                  value={newSubj.total}
                  onChange={(e) => setNewSubj({ ...newSubj, total: e.target.value })}
                />
              </div>
              <div className="col-6 col-md-2 d-flex align-items-end mb-3">
                <button type="submit" className="btn-primary-custom w-100 py-2">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Subject-Wise Attendance Cards */}
      <div className="row g-3">
        {attendance.map((subj) => {
          const percent = subj.total > 0 ? Math.round((subj.attended / subj.total) * 100) : 100;
          const bunkCalc = calculateSubjectBunk(subj.attended, subj.total);

          return (
            <div className="col-12 col-lg-6" key={subj.id}>
              <div className="glass-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <span className="badge bg-secondary mb-1">{subj.code}</span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }} className="m-0">
                        {subj.subject}
                      </h4>
                    </div>
                    <div className="text-end">
                      <span
                        className="display-6 fw-bold"
                        style={{ fontSize: '24px', color: percent >= target ? '#10b981' : '#f43f5e' }}
                      >
                        {percent}%
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between small text-muted my-2">
                    <span>
                      Attended: <strong>{subj.attended}</strong> / {subj.total} Lectures
                    </span>
                    {subj.instructor && <span>Prof: {subj.instructor}</span>}
                  </div>

                  <div className="progress mb-3" style={{ height: '6px', borderRadius: '3px' }}>
                    <div
                      className={`progress-bar ${percent >= target ? 'bg-success' : 'bg-danger'}`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>

                  {/* Bunk advice pill */}
                  <div
                    className={`p-2 rounded-2 small d-flex align-items-center gap-2 ${
                      bunkCalc.safe ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                    }`}
                  >
                    <i className={`bi ${bunkCalc.safe ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
                    <span>
                      {bunkCalc.safe
                        ? `Safe! You can bunk ${bunkCalc.count} lecture${bunkCalc.count === 1 ? '' : 's'}`
                        : `Warning! Attend next ${bunkCalc.count} lecture${bunkCalc.count === 1 ? '' : 's'} consecutively`}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-success px-3"
                      onClick={() => handleMark(subj.id, 'present')}
                      title="Attended lecture (+1)"
                    >
                      <i className="bi bi-plus-lg me-1" /> Present
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger px-3"
                      onClick={() => handleMark(subj.id, 'absent')}
                      title="Missed lecture (+0 attended, +1 total)"
                    >
                      <i className="bi bi-x-lg me-1" /> Absent
                    </button>
                  </div>

                  <button
                    className="btn btn-sm text-muted"
                    onClick={() => handleDeleteSubject(subj.id)}
                    title="Delete Subject"
                  >
                    <i className="bi bi-trash3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
