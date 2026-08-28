import React from 'react';

export default function BottomNav({ activeScreen, setActiveScreen, user }) {
  const isFaculty = user?.role === 'faculty';

  const studentTabs = [
    { id: 'home', label: 'Home', icon: 'bi-grid-1x2-fill' },
    { id: 'vault', label: 'Vault', icon: 'bi-mortarboard-fill' },
    { id: 'community', label: 'Forum', icon: 'bi-chat-square-quote-fill' },
    { id: 'attendance', label: 'Bunk', icon: 'bi-pie-chart-fill' },
    { id: 'assistant', label: 'AI Study', icon: 'bi-robot' },
    { id: 'profile', label: 'More', icon: 'bi-three-dots' },
  ];

  const facultyTabs = [
    { id: 'faculty-home', label: 'Home', icon: 'bi-speedometer2' },
    { id: 'mark-attendance', label: 'Attendance', icon: 'bi-clipboard-check-fill' },
    { id: 'upload-resource', label: 'Upload', icon: 'bi-cloud-arrow-up-fill' },
    { id: 'approve-leaves', label: 'Leaves', icon: 'bi-envelope-check-fill' },
    { id: 'community', label: 'Forum', icon: 'bi-chat-square-quote-fill' },
    { id: 'profile', label: 'Settings', icon: 'bi-gear-fill' },
  ];

  const tabs = isFaculty ? facultyTabs : studentTabs;

  return (
    <nav className="bottom-navigation">
      {tabs.map((tab) => {
        const isActive = activeScreen === tab.id;
        return (
          <button
            key={tab.id}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveScreen(tab.id)}
          >
            <i className={`bi ${tab.icon}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
