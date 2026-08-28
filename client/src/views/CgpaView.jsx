import React, { useState, useMemo } from 'react';

export default function CgpaView({
  cgpaData,
  onUpdateCgpa,
  onToast,
}) {
  const [targetCgpa, setTargetCgpa] = useState(cgpaData?.target || 8.5);
  const [selectedSem, setSelectedSem] = useState(cgpaData?.semesters?.[0]?.sem || 1);
  const [newCourse, setNewCourse] = useState({ name: '', credits: 4, grade: 'A', points: 9 });

  const gradeMap = {
    'O (Outstanding)': 10,
    'A+ (Excellent)': 9,
    'A (Very Good)': 8,
    'B+ (Good)': 7,
    'B (Above Average)': 6,
    'C (Average)': 5,
    'P (Pass)': 4,
    'F (Fail)': 0,
  };

  // Cumulative CGPA calculation
  const stats = useMemo(() => {
    let totalCreditPoints = 0;
    let totalCredits = 0;

    (cgpaData?.semesters || []).forEach((sem) => {
      let semPoints = 0;
      let semCredits = 0;
      (sem.courses || []).forEach((c) => {
        semPoints += (c.credits || 0) * (c.points || 0);
        semCredits += c.credits || 0;
      });

      totalCreditPoints += semPoints;
      totalCredits += semCredits;
    });

    const currentCgpa = totalCredits > 0 ? (totalCreditPoints / totalCredits).toFixed(2) : '0.00';
    const completedSems = (cgpaData?.semesters || []).length;
    const remainingSems = Math.max(0, 8 - completedSems);

    // Target planner formula
    // (totalCreditPoints + remainingCredits * requiredSgpa) / (totalCredits + remainingCredits) = targetCgpa
    const avgSemCredits = 22;
    const totalFutureCredits = remainingSems * avgSemCredits;
    const totalAllCredits = totalCredits + totalFutureCredits;
    const requiredTotalPoints = targetCgpa * totalAllCredits;
    const neededFuturePoints = requiredTotalPoints - totalCreditPoints;
    const requiredSgpa = remainingSems > 0 ? (neededFuturePoints / totalFutureCredits).toFixed(2) : currentCgpa;

    return {
      currentCgpa: Number(currentCgpa),
      totalCredits,
      completedSems,
      remainingSems,
      requiredSgpa: Number(requiredSgpa),
    };
  }, [cgpaData, targetCgpa]);

  const currentSemObj = (cgpaData?.semesters || []).find((s) => s.sem === selectedSem) || cgpaData?.semesters?.[0];

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.name) return;

    const updatedSemesters = (cgpaData?.semesters || []).map((s) => {
      if (s.sem === selectedSem) {
        const updatedCourses = [...(s.courses || []), { ...newCourse }];
        // Recalculate SGPA
        const totCred = updatedCourses.reduce((acc, c) => acc + Number(c.credits), 0);
        const totPts = updatedCourses.reduce((acc, c) => acc + Number(c.credits) * Number(c.points), 0);
        const sgpa = totCred > 0 ? Number((totPts / totCred).toFixed(2)) : 0;
        return { ...s, courses: updatedCourses, credits: totCred, sgpa };
      }
      return s;
    });

    onUpdateCgpa({ ...cgpaData, semesters: updatedSemesters });
    setNewCourse({ name: '', credits: 4, grade: 'A', points: 9 });
    if (onToast) onToast('Course added and SGPA updated!', 'success');
  };

  const handleDeleteCourse = (courseIndex) => {
    const updatedSemesters = (cgpaData?.semesters || []).map((s) => {
      if (s.sem === selectedSem) {
        const updatedCourses = s.courses.filter((_, idx) => idx !== courseIndex);
        const totCred = updatedCourses.reduce((acc, c) => acc + Number(c.credits), 0);
        const totPts = updatedCourses.reduce((acc, c) => acc + Number(c.credits) * Number(c.points), 0);
        const sgpa = totCred > 0 ? Number((totPts / totCred).toFixed(2)) : 0;
        return { ...s, courses: updatedCourses, credits: totCred, sgpa };
      }
      return s;
    });
    onUpdateCgpa({ ...cgpaData, semesters: updatedSemesters });
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-calculator-fill text-primary me-2" /> GPA & CGPA Target Simulator
          </h2>
          <p className="text-muted small">Semester-wise SGPA calculations and target grade goals</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="small font-weight-bold">Target Goal:</span>
          <input
            type="number"
            step="0.05"
            min="5.0"
            max="10.0"
            className="form-control form-control-sm"
            style={{ width: '90px' }}
            value={targetCgpa}
            onChange={(e) => setTargetCgpa(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="glass-card text-center p-4">
            <div className="text-muted small mb-1">Current Cumulative CGPA</div>
            <div className="display-4 fw-bold text-primary">{stats.currentCgpa}</div>
            <span className="badge bg-secondary mt-1">{stats.totalCredits} Earned Credits</span>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="glass-card text-center p-4">
            <div className="text-muted small mb-1">Target CGPA Goal</div>
            <div className="display-4 fw-bold text-success">{targetCgpa}</div>
            <span className="badge bg-success-subtle text-success mt-1">Goal for Graduation</span>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="glass-card text-center p-4">
            <div className="text-muted small mb-1">Required Avg SGPA (Remaining Sems)</div>
            <div className={`display-4 fw-bold ${stats.requiredSgpa <= 10 ? 'text-info' : 'text-danger'}`}>
              {stats.requiredSgpa <= 10 ? stats.requiredSgpa : '10+'}
            </div>
            <span className={`badge ${stats.requiredSgpa <= 10 ? 'bg-info-subtle text-info' : 'bg-danger'} mt-1`}>
              {stats.remainingSems} Semesters Remaining
            </span>
          </div>
        </div>
      </div>

      {/* Semester Breakdown & Course Table */}
      <div className="glass-card">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <div className="d-flex gap-2">
            {(cgpaData?.semesters || []).map((s) => (
              <button
                key={s.sem}
                className={`btn btn-sm ${selectedSem === s.sem ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedSem(s.sem)}
              >
                Sem {s.sem} ({s.sgpa || '0.00'})
              </button>
            ))}
          </div>

          <div>
            <strong>Sem {selectedSem} SGPA: </strong>
            <span className="badge bg-primary fs-6">{currentSemObj?.sgpa || '0.00'}</span>
          </div>
        </div>

        {/* Courses Table */}
        <div className="table-responsive mb-4">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Course Name</th>
                <th style={{ width: '110px' }}>Credits</th>
                <th style={{ width: '130px' }}>Grade</th>
                <th style={{ width: '110px' }}>Points</th>
                <th style={{ width: '60px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {(currentSemObj?.courses || []).map((course, idx) => (
                <tr key={idx}>
                  <td><strong>{course.name}</strong></td>
                  <td>{course.credits}</td>
                  <td><span className="badge bg-secondary">{course.grade}</span></td>
                  <td>{course.points}</td>
                  <td>
                    <button
                      className="btn btn-sm text-danger p-0"
                      onClick={() => handleDeleteCourse(idx)}
                      title="Remove Course"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Course Row */}
        <form onSubmit={handleAddCourse} className="p-3 rounded-3 bg-surface-elevated border">
          <h5 style={{ fontSize: '13px', fontWeight: '800' }} className="mb-2 text-uppercase text-muted">
            Add Subject to Semester {selectedSem}
          </h5>
          <div className="row g-2">
            <div className="col-12 col-md-5">
              <input
                type="text"
                required
                className="form-input-custom"
                placeholder="Course Name (e.g. Distributed Systems)"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
            </div>
            <div className="col-6 col-md-2">
              <input
                type="number"
                min="1"
                max="10"
                required
                className="form-input-custom"
                placeholder="Credits"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
              />
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-input-custom"
                value={newCourse.points}
                onChange={(e) => {
                  const pts = Number(e.target.value);
                  const gradeKey = Object.keys(gradeMap).find((k) => gradeMap[k] === pts) || 'A';
                  setNewCourse({ ...newCourse, points: pts, grade: gradeKey.split(' ')[0] });
                }}
              >
                {Object.entries(gradeMap).map(([label, pts]) => (
                  <option key={label} value={pts}>
                    {label} ({pts} pts)
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <button type="submit" className="btn-primary-custom w-100 py-2">
                <i className="bi bi-plus-lg" /> Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
