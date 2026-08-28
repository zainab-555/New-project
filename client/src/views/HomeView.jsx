import React, { useMemo } from 'react';

export default function HomeView({
  profile,
  classes = [],
  attendance = [],
  assignments = [],
  notes = [],
  onNavigate,
  onOpenAddClass,
  onOpenAddAssignment,
  onAskAiPrompt,
}) {
  // Calculate overall attendance
  const overallAttendance = useMemo(() => {
    if (!attendance || attendance.length === 0) return { percent: 85, attended: 0, total: 0 };
    const totalAttended = attendance.reduce((acc, cur) => acc + (cur.attended || 0), 0);
    const totalClasses = attendance.reduce((acc, cur) => acc + (cur.total || 0), 0);
    const percent = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 100;
    return { percent, attended: totalAttended, total: totalClasses };
  }, [attendance]);

  // Safe bunk calculation
  const targetThreshold = profile?.targetAttendance || 75;
  const bunkStatus = useMemo(() => {
    const { attended, total } = overallAttendance;
    if (total === 0) return { canBunk: 0, needAttend: 0, isSafe: true };

    const targetRatio = targetThreshold / 100;
    // Condition to stay >= targetRatio: attended / (total + x) >= targetRatio => x <= (attended / targetRatio) - total
    const safeBunks = Math.floor(attended / targetRatio - total);

    if (safeBunks >= 0) {
      return { canBunk: safeBunks, needAttend: 0, isSafe: true };
    } else {
      // Need to attend: (attended + y) / (total + y) >= targetRatio => y >= (targetRatio * total - attended) / (1 - targetRatio)
      const need = Math.ceil((targetRatio * total - attended) / (1 - targetRatio));
      return { canBunk: 0, needAttend: need > 0 ? need : 0, isSafe: false };
    }
  }, [overallAttendance, targetThreshold]);

  // Today's classes
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDay = daysOfWeek[new Date().getDay()] || 'Mon';
  const effectiveDay = todayDay === 'Sun' ? 'Mon' : todayDay; // default to Mon on Sunday

  const todayClasses = useMemo(() => {
    return classes.filter((c) => c.day === effectiveDay);
  }, [classes, effectiveDay]);

  const pendingAssignments = useMemo(() => {
    return assignments.filter((a) => a.status !== 'completed');
  }, [assignments]);

  // Circumference for circular gauge
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallAttendance.percent / 100) * circumference;

  return (
    <div className="d-flex flex-column gap-4">
      {/* AI Assistant Hero Quick Banner */}
      <div
        className="assistant-hero-banner"
        onClick={() => onNavigate('assistant')}
      >
        <div className="assistant-hero-content">
          <h3>
            <i className="bi bi-stars text-warning" /> AI Study Assistant & Doubt Solver
          </h3>
          <p>
            Get instant exam solutions, code explanations, revision flashcards, or draft formal leave applications in seconds.
          </p>
          <div className="d-flex gap-2 flex-wrap mt-3">
            {['Explain ACID Properties', 'Process vs Thread in OS', 'Leave Letter Draft'].map((chip) => (
              <span
                key={chip}
                className="prompt-chip"
                onClick={(e) => {
                  e.stopPropagation();
                  onAskAiPrompt(chip);
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="assistant-hero-icon d-none d-sm-grid">
          <i className="bi bi-robot" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-box indigo">
          <div className="stat-box-header">
            <span>Attendance</span>
            <i className="bi bi-pie-chart-fill text-primary" />
          </div>
          <div className="stat-box-value">{overallAttendance.percent}%</div>
          <div className="stat-box-sub">
            <span className={overallAttendance.percent >= targetThreshold ? 'text-success' : 'text-danger'}>
              {overallAttendance.percent >= targetThreshold ? '● Above Target' : '● Below Target'}
            </span>
            <span>({targetThreshold}%)</span>
          </div>
        </div>

        <div className="stat-box emerald">
          <div className="stat-box-header">
            <span>Target CGPA</span>
            <i className="bi bi-trophy-fill text-success" />
          </div>
          <div className="stat-box-value">{profile?.targetCgpa || 8.5}</div>
          <div className="stat-box-sub text-muted">
            <i className="bi bi-arrow-up-right" /> Current: 8.50
          </div>
        </div>

        <div className="stat-box amber">
          <div className="stat-box-header">
            <span>Assignments</span>
            <i className="bi bi-clock-history text-warning" />
          </div>
          <div className="stat-box-value">{pendingAssignments.length}</div>
          <div className="stat-box-sub text-muted">
            {pendingAssignments.filter((a) => a.priority === 'High').length} High Priority
          </div>
        </div>

        <div className="stat-box rose">
          <div className="stat-box-header">
            <span>Today's Classes</span>
            <i className="bi bi-calendar-event text-danger" />
          </div>
          <div className="stat-box-value">{todayClasses.length}</div>
          <div className="stat-box-sub text-muted">
            Day: {effectiveDay}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Today's Schedule & Bunk-O-Meter */}
        <div className="col-12 col-lg-7 d-flex flex-column gap-4">
          {/* Bunk-O-Meter Widget */}
          <div className="glass-card bunkometer-card">
            <div className="card-header-flex">
              <div>
                <h3>
                  <i className="bi bi-shield-check text-primary" /> Live Bunk-O-Meter
                </h3>
                <p>Safe bunk planner based on your {targetThreshold}% college criteria</p>
              </div>
              <button className="card-action-btn" onClick={() => onNavigate('attendance')}>
                Manage &rarr;
              </button>
            </div>

            <div className="bunkometer-body">
              <div className="circular-gauge">
                <svg width="110" height="110">
                  <circle cx="55" cy="55" r={radius} className="gauge-bg" />
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    className="gauge-fill"
                    stroke={bunkStatus.isSafe ? '#10b981' : '#f43f5e'}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="gauge-inner-text">
                  <strong>{overallAttendance.percent}%</strong>
                  <small>{overallAttendance.attended}/{overallAttendance.total}</small>
                </div>
              </div>

              <div className="bunk-status-info">
                <div className={`bunk-pill-status ${bunkStatus.isSafe ? 'safe' : 'danger'}`}>
                  <i className={`bi ${bunkStatus.isSafe ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
                  <span>
                    {bunkStatus.isSafe
                      ? `You can safely bunk ${bunkStatus.canBunk} more lecture${bunkStatus.canBunk === 1 ? '' : 's'}`
                      : `Critical! Attend next ${bunkStatus.needAttend} lecture${bunkStatus.needAttend === 1 ? '' : 's'} without skipping`}
                  </span>
                </div>
                <p>
                  Maintain attendance above {targetThreshold}% to avoid exam debarment. Track per-subject attendance on the Attendance tab.
                </p>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="glass-card">
            <div className="card-header-flex">
              <div>
                <h3>
                  <i className="bi bi-calendar-week text-primary" /> Today's Schedule ({effectiveDay})
                </h3>
                <p>{todayClasses.length} lectures scheduled for today</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={onOpenAddClass}>
                  <i className="bi bi-plus-lg me-1" /> Add
                </button>
                <button className="card-action-btn" onClick={() => onNavigate('timetable')}>
                  All &rarr;
                </button>
              </div>
            </div>

            {todayClasses.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-cup-hot" style={{ fontSize: '32px' }} />
                <p className="mt-2">No lectures scheduled for {effectiveDay}! Enjoy your free time or prepare for assignments.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {todayClasses.map((item) => (
                  <div key={item._id || item.code} className="class-card-item">
                    <div className="class-time-block">
                      <strong>{item.time}</strong>
                      <span>{item.time.includes('AM') ? 'Morning' : 'Afternoon'}</span>
                    </div>
                    <div className="class-info-block">
                      <h4>{item.title}</h4>
                      <div className="class-meta">
                        <span><i className="bi bi-geo-alt" /> {item.room || 'LH-101'}</span>
                        {item.instructor && <span><i className="bi bi-person" /> {item.instructor}</span>}
                      </div>
                    </div>
                    <span className={`class-tone-pill tone-${item.tone || 'indigo'}`}>
                      {item.code}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deadlines & Recent Notes */}
        <div className="col-12 col-lg-5 d-flex flex-column gap-4">
          {/* Upcoming Deadlines */}
          <div className="glass-card">
            <div className="card-header-flex">
              <div>
                <h3>
                  <i className="bi bi-hourglass-split text-warning" /> Pending Deadlines
                </h3>
                <p>Assignments & project submissions</p>
              </div>
              <button className="card-action-btn" onClick={() => onNavigate('assignments')}>
                View All &rarr;
              </button>
            </div>

            {pendingAssignments.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '30px' }} />
                <p className="mt-2">All assignments caught up! Great job.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {pendingAssignments.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-3 border d-flex flex-column gap-2"
                    style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <strong style={{ fontSize: '13px' }}>{item.title}</strong>
                      <span className={`badge ${item.priority === 'High' ? 'bg-danger' : item.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between small text-muted">
                      <span><i className="bi bi-book me-1" /> {item.subject}</span>
                      <span><i className="bi bi-calendar me-1" /> Due: {item.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Study Notes / Cheatsheets */}
          <div className="glass-card">
            <div className="card-header-flex">
              <div>
                <h3>
                  <i className="bi bi-bookmark-star-fill text-primary" /> Pinned Notes
                </h3>
                <p>Quick revision & interview cheat sheets</p>
              </div>
              <button className="card-action-btn" onClick={() => onNavigate('notes')}>
                Notes &rarr;
              </button>
            </div>

            <div className="d-flex flex-column gap-2">
              {notes.filter((n) => n.pinned).slice(0, 2).map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-3 border"
                  style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                  onClick={() => onNavigate('notes')}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <strong style={{ fontSize: '13px' }}>{n.title}</strong>
                    <span className="badge bg-primary">{n.category}</span>
                  </div>
                  <p className="small text-muted mb-0" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {n.content.replace(/[#*`]/g, '')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
