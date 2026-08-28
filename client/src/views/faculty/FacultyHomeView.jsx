import React from 'react';

export default function FacultyHomeView({
  user,
  classes = [],
  leaves = [],
  resources = [],
  onNavigate,
}) {
  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const facultyResources = resources.filter((r) => r.uploadedBy?.name?.includes('Sharma') || r.uploadedBy?.role === 'faculty');

  return (
    <div className="d-flex flex-column gap-4">
      {/* Faculty Hero Banner */}
      <div className="assistant-hero-banner" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(99, 102, 241, 0.2))' }}>
        <div className="assistant-hero-content">
          <span className="badge bg-warning text-dark mb-2">
            <i className="bi bi-patch-check-fill me-1" /> Verified Faculty Portal
          </span>
          <h3>Welcome, {user?.name || 'Professor'}</h3>
          <p>
            {user?.designation || 'Associate Professor'} · {user?.department || 'Computer Science & Engineering'}
          </p>
          <div className="d-flex gap-2 flex-wrap mt-3">
            <button className="btn btn-sm btn-primary" onClick={() => onNavigate('mark-attendance')}>
              <i className="bi bi-clipboard-check me-1" /> Mark Class Attendance
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onNavigate('upload-resource')}>
              <i className="bi bi-cloud-arrow-up me-1" /> Upload Notes / PYQ
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onNavigate('approve-leaves')}>
              <i className="bi bi-envelope-check me-1" /> Review Leaves ({pendingLeaves.length})
            </button>
          </div>
        </div>
        <div className="assistant-hero-icon d-none d-sm-grid" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <i className="bi bi-person-workspace" />
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-box amber">
          <div className="stat-box-header">
            <span>Pending Leaves</span>
            <i className="bi bi-envelope-exclamation text-warning" />
          </div>
          <div className="stat-box-value">{pendingLeaves.length}</div>
          <div className="stat-box-sub text-muted">Awaiting your approval</div>
        </div>

        <div className="stat-box indigo">
          <div className="stat-box-header">
            <span>Teaching Classes</span>
            <i className="bi bi-calendar-check text-primary" />
          </div>
          <div className="stat-box-value">{classes.length}</div>
          <div className="stat-box-sub text-muted">Active weekly slots</div>
        </div>

        <div className="stat-box emerald">
          <div className="stat-box-header">
            <span>Published Resources</span>
            <i className="bi bi-folder-check text-success" />
          </div>
          <div className="stat-box-value">{facultyResources.length}</div>
          <div className="stat-box-sub text-muted">Across 8 Semesters</div>
        </div>

        <div className="stat-box rose">
          <div className="stat-box-header">
            <span>Student Roster</span>
            <i className="bi bi-people-fill text-danger" />
          </div>
          <div className="stat-box-value">64</div>
          <div className="stat-box-sub text-muted">Enrolled in Batch</div>
        </div>
      </div>

      {/* Quick Management Rows */}
      <div className="row g-4">
        {/* Pending Leaves Alert Box */}
        <div className="col-12 col-lg-6">
          <div className="glass-card h-100">
            <div className="card-header-flex">
              <div>
                <h3>
                  <i className="bi bi-envelope-paper-fill text-warning" /> Student Leave Applications
                </h3>
                <p>{pendingLeaves.length} pending requests from AI Study Assistant</p>
              </div>
              <button className="card-action-btn" onClick={() => onNavigate('approve-leaves')}>
                View All &rarr;
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '32px' }} />
                <p className="mt-2">No pending leave requests!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {pendingLeaves.map((leave) => (
                  <div key={leave._id} className="p-3 rounded-3 bg-surface-elevated border">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <strong>{leave.studentName}</strong>
                      <span className="badge bg-secondary">{leave.studentRoll}</span>
                    </div>
                    <p className="small text-muted mb-2">{leave.reason}</p>
                    <div className="d-flex align-items-center justify-content-between small text-muted">
                      <span><i className="bi bi-calendar me-1" /> {leave.startDate} to {leave.endDate}</span>
                      <button className="btn btn-sm btn-primary py-0 px-2" onClick={() => onNavigate('approve-leaves')}>
                        Review &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Teaching Timetable Quick View */}
        <div className="col-12 col-lg-6">
          <div className="glass-card h-100">
            <div className="card-header-flex">
              <div>
                <h3>
                  <i className="bi bi-calendar-week text-primary" /> Teaching Schedule
                </h3>
                <p>Your scheduled lecture halls and labs</p>
              </div>
              <button className="card-action-btn" onClick={() => onNavigate('faculty-timetable')}>
                Full Schedule &rarr;
              </button>
            </div>

            <div className="d-flex flex-column gap-2">
              {classes.slice(0, 3).map((item) => (
                <div key={item._id || item.code} className="class-card-item">
                  <div className="class-time-block">
                    <strong>{item.time}</strong>
                    <span className="badge bg-secondary">{item.day}</span>
                  </div>
                  <div className="class-info-block">
                    <h4>{item.title}</h4>
                    <div className="class-meta">
                      <span><i className="bi bi-geo-alt" /> {item.room}</span>
                      <span><i className="bi bi-hash" /> {item.code}</span>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onNavigate('mark-attendance')}>
                    Attendance
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
