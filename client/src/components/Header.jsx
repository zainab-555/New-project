import React from 'react';

export default function Header({
  user,
  theme,
  toggleTheme,
  backendStatus,
  onOpenSearch,
  onOpenNotification,
  onLogout,
  unreadCount = 0,
}) {
  const isFaculty = user?.role === 'faculty';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-greeting">
          <h1>
            {getGreeting()}, {user?.name?.split(' ')[0] || (isFaculty ? 'Professor' : 'Student')}! <span>👋</span>
          </h1>
          <p>
            {isFaculty ? (
              <span className="badge bg-warning text-dark me-2">
                <i className="bi bi-patch-check-fill me-1" /> Faculty Portal
              </span>
            ) : (
              <span className="badge bg-primary me-2">
                <i className="bi bi-mortarboard-fill me-1" /> Student (Sem {user?.semester || 6})
              </span>
            )}
            {user?.college || 'National Institute of Technology'} · {isFaculty ? (user?.department || 'CSE') : (user?.enrollmentNo || '21BCSE042')}
          </p>
        </div>

        <div className="header-actions">
          {/* Backend Status Indicator */}
          <div
            className={`server-status-pill ${backendStatus.online ? 'online' : 'offline'}`}
            title={backendStatus.online ? `API Online ${backendStatus.database ? '(DB Connected)' : '(No DB)'}` : 'Backend Offline (Using local storage)'}
          >
            <span className="status-dot" />
            <span>{backendStatus.online ? (backendStatus.database ? 'API + DB' : 'API Online') : 'Local Mode'}</span>
          </div>

          {/* Quick Search */}
          <button className="search-trigger" onClick={onOpenSearch} title="Quick Search">
            <i className="bi bi-search" />
            <span>Search vault, forum...</span>
            <kbd>Ctrl K</kbd>
          </button>

          {/* Theme Switcher */}
          <button
            className="header-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle Theme"
          >
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-primary'}`} />
          </button>

          {/* Notification Button */}
          <button
            className="header-btn"
            onClick={onOpenNotification}
            title="Notifications"
            aria-label="Notifications"
          >
            <i className="bi bi-bell-fill" />
            {unreadCount > 0 && <span className="badge-dot" />}
          </button>

          {/* Logout Button */}
          <button
            className="header-btn text-danger"
            onClick={onLogout}
            title="Logout / Switch Account"
            aria-label="Logout"
          >
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </div>
    </header>
  );
}
