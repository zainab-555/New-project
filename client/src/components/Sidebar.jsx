import React from 'react';

export default function Sidebar({
  activeScreen,
  setActiveScreen,
  isCollapsed,
  toggleCollapse,
  user,
  pendingAssignmentsCount = 0,
  pendingLeavesCount = 0,
  onLogout,
}) {
  const isFaculty = user?.role === 'faculty';

  const studentNav = [
    { id: 'home', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { id: 'vault', label: 'Academic Vault', icon: 'bi-mortarboard-fill', badgeText: '1–8 Sem' },
    { id: 'community', label: 'Community Forum', icon: 'bi-chat-square-quote-fill' },
    { id: 'attendance', label: 'Attendance & Bunk', icon: 'bi-pie-chart-fill' },
    { id: 'timetable', label: 'Timetable', icon: 'bi-calendar3' },
    { id: 'assistant', label: 'AI Study Assistant', icon: 'bi-robot' },
    { id: 'assignments', label: 'Assignments', icon: 'bi-check2-square', badge: pendingAssignmentsCount },
    { id: 'notes', label: 'Notes & Cheatsheets', icon: 'bi-journal-text' },
    { id: 'cgpa', label: 'GPA Target', icon: 'bi-calculator-fill' },
    { id: 'profile', label: 'Settings', icon: 'bi-gear-fill' },
  ];

  const facultyNav = [
    { id: 'faculty-home', label: 'Faculty Dashboard', icon: 'bi-speedometer2' },
    { id: 'mark-attendance', label: 'Mark Attendance', icon: 'bi-clipboard-check-fill' },
    { id: 'upload-resource', label: 'Upload Resources', icon: 'bi-cloud-arrow-up-fill' },
    { id: 'approve-leaves', label: 'Approve Leaves', icon: 'bi-envelope-check-fill', badge: pendingLeavesCount },
    { id: 'vault', label: 'Academic Vault', icon: 'bi-mortarboard-fill' },
    { id: 'community', label: 'Community Forum', icon: 'bi-chat-square-quote-fill' },
    { id: 'faculty-timetable', label: 'Teaching Schedule', icon: 'bi-calendar-week-fill' },
    { id: 'profile', label: 'Faculty Settings', icon: 'bi-gear-fill' },
  ];

  const navItems = isFaculty ? facultyNav : studentNav;

  const getInitials = (name) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';
  };

  return (
    <aside className="app-sidebar">
      {/* Sidebar Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <i className={`bi ${isFaculty ? 'bi-person-workspace' : 'bi-mortarboard-fill'}`} />
        </div>
        <div className="logo-text">
          <h2>CampusHub</h2>
          <span>{isFaculty ? 'Faculty Portal' : 'Student Portal'}</span>
        </div>
        <button
          className="ms-auto d-none d-lg-block text-muted"
          style={{ fontSize: '18px' }}
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} />
        </button>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-2 mb-3">
        <div
          className={`p-2 rounded-3 small d-flex align-items-center gap-2 ${
            isFaculty ? 'bg-warning-subtle text-dark border border-warning' : 'bg-primary-subtle text-primary border border-primary'
          }`}
        >
          <i className={`bi ${isFaculty ? 'bi-patch-check-fill text-warning' : 'bi-person-badge text-primary'}`} />
          <span className="fw-bold text-truncate">
            {isFaculty ? 'Faculty Access' : `Student (Sem ${user?.semester || 6})`}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav" style={{ overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveScreen(item.id)}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
              {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
              {item.badgeText && <span className="badge bg-secondary ms-auto small">{item.badgeText}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      <div className="d-flex flex-column gap-2 mt-auto pt-2 border-top">
        <div
          className="sidebar-user-card"
          onClick={() => setActiveScreen('profile')}
          style={{ cursor: 'pointer' }}
        >
          <div className="avatar-circle" style={{ background: isFaculty ? 'linear-gradient(135deg, #f59e0b, #d97706)' : undefined }}>
            {getInitials(user?.name)}
          </div>
          <div className="sidebar-user-info">
            <strong>{user?.name || 'User'}</strong>
            <small>{isFaculty ? (user?.designation || 'Faculty') : (user?.enrollmentNo || 'Student')}</small>
          </div>
        </div>

        <button
          className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onLogout}
          title="Switch Account / Logout"
        >
          <i className="bi bi-box-arrow-right" />
          <span>Switch / Logout</span>
        </button>
      </div>
    </aside>
  );
}
