import React, { useState, useMemo } from 'react';
import { getSubjectsForSemester } from '../../services/academicCurriculum';

export default function MarkAttendanceView({
  roster = [],
  onSaveAttendance,
  user,
  onToast,
}) {
  const [selectedSemester, setSelectedSemester] = useState(6);
  const [selectedSubject, setSelectedSubject] = useState('Full Stack Web Development (MERN Stack)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentRecords, setStudentRecords] = useState(roster);
  const [isSaving, setIsSaving] = useState(false);

  const subjects = useMemo(() => getSubjectsForSemester(selectedSemester), [selectedSemester]);

  const stats = useMemo(() => {
    const total = studentRecords.length;
    const present = studentRecords.filter((r) => r.status === 'present').length;
    const absent = studentRecords.filter((r) => r.status === 'absent').length;
    const late = studentRecords.filter((r) => r.status === 'late').length;
    const percent = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;
    return { total, present, absent, late, percent };
  }, [studentRecords]);

  const handleToggleStatus = (rollNo, nextStatus) => {
    setStudentRecords((prev) =>
      prev.map((s) => (s.studentRoll === rollNo ? { ...s, status: nextStatus } : s))
    );
  };

  const handleMarkAll = (status) => {
    setStudentRecords((prev) => prev.map((s) => ({ ...s, status })));
    if (onToast) onToast(`Marked all students as ${status.toUpperCase()}!`, 'info');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        semester: selectedSemester,
        subject: selectedSubject,
        date,
        records: studentRecords,
        facultyId: user?.id || user?.facultyId || 'FAC-01',
        facultyName: user?.name || 'Ajaz Hussain Warsi',
      };
      await onSaveAttendance(payload);
      if (onToast) onToast(`Attendance for ${selectedSubject} saved successfully!`, 'success');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-clipboard-check-fill text-primary me-2" /> Mark Class Attendance
          </h2>
          <p className="text-muted small">
            Select subject and toggle student attendance status with live metrics
          </p>
        </div>

        <button className="btn-primary-custom py-2 px-4" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : <><i className="bi bi-cloud-check-fill" /> Publish Attendance</>}
        </button>
      </div>

      {/* Class Selector Bar */}
      <div className="glass-card p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-3">
            <label className="small text-muted fw-bold text-uppercase mb-1 d-block">Semester</label>
            <select
              className="form-select form-select-sm"
              value={selectedSemester}
              onChange={(e) => {
                const sem = Number(e.target.value);
                setSelectedSemester(sem);
                const subjs = getSubjectsForSemester(sem);
                if (subjs.length > 0) setSelectedSubject(subjs[0].name);
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-5">
            <label className="small text-muted fw-bold text-uppercase mb-1 d-block">Subject / Lab</label>
            <select
              className="form-select form-select-sm"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.code} · {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="small text-muted fw-bold text-uppercase mb-1 d-block">Session Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Live Session Stats Bar */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="stat-box indigo p-3">
            <small className="text-muted">Total Enrolled</small>
            <div className="stat-box-value fs-4">{stats.total}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-box emerald p-3">
            <small className="text-success">Present</small>
            <div className="stat-box-value fs-4 text-success">{stats.present}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-box rose p-3">
            <small className="text-danger">Absent</small>
            <div className="stat-box-value fs-4 text-danger">{stats.absent}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-box amber p-3">
            <small className="text-warning">Late / Partial</small>
            <div className="stat-box-value fs-4 text-warning">{stats.late}</div>
          </div>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="glass-card p-4">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '800' }} className="m-0">
              Student Attendance Roster
            </h4>
            <span className="small text-muted">Click on Present, Absent, or Late to toggle</span>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-success" onClick={() => handleMarkAll('present')}>
              ✓ Mark All Present
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleMarkAll('absent')}>
              ✗ Mark All Absent
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th style={{ width: '160px' }}>Roll Number</th>
                <th>Student Name</th>
                <th style={{ width: '260px' }} className="text-center">Status Selection</th>
              </tr>
            </thead>
            <tbody>
              {studentRecords.map((stu, idx) => (
                <tr key={stu.studentRoll}>
                  <td>{idx + 1}</td>
                  <td>
                    <span className="badge bg-secondary font-monospace">{stu.studentRoll}</span>
                  </td>
                  <td>
                    <strong>{stu.studentName}</strong>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm w-100">
                      <button
                        className={`btn ${stu.status === 'present' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => handleToggleStatus(stu.studentRoll, 'present')}
                      >
                        ● Present
                      </button>
                      <button
                        className={`btn ${stu.status === 'late' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
                        onClick={() => handleToggleStatus(stu.studentRoll, 'late')}
                      >
                        ● Late
                      </button>
                      <button
                        className={`btn ${stu.status === 'absent' ? 'btn-danger' : 'btn-outline-secondary'}`}
                        onClick={() => handleToggleStatus(stu.studentRoll, 'absent')}
                      >
                        ● Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
