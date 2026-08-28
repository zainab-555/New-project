import React, { useState, useEffect, useRef } from 'react';

export default function QuickSearchModal({
  isOpen,
  onClose,
  classes = [],
  notes = [],
  assignments = [],
  onNavigate,
  onAskAi,
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(null, 'open-search');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter matching items
  const matchedClasses = classes.filter(
    (c) =>
      c.title?.toLowerCase().includes(cleanQuery) ||
      c.code?.toLowerCase().includes(cleanQuery) ||
      c.room?.toLowerCase().includes(cleanQuery)
  );

  const matchedNotes = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(cleanQuery) ||
      n.category?.toLowerCase().includes(cleanQuery) ||
      n.content?.toLowerCase().includes(cleanQuery)
  );

  const matchedAssignments = assignments.filter(
    (a) =>
      a.title?.toLowerCase().includes(cleanQuery) ||
      a.subject?.toLowerCase().includes(cleanQuery)
  );

  const handleSelect = (action) => {
    onClose();
    action();
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="d-flex align-items-center gap-3 pb-3 border-bottom mb-3">
          <i className="bi bi-search text-primary" style={{ fontSize: '18px' }} />
          <input
            ref={inputRef}
            type="text"
            className="border-0 bg-transparent text-main flex-1 w-100"
            style={{ fontSize: '16px', outline: 'none' }}
            placeholder="Search classes, notes, assignments or ask AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={onClose}>
            ESC
          </button>
        </div>

        {cleanQuery.length > 0 && (
          <div className="mb-3">
            <div
              className="p-3 rounded-3 d-flex align-items-center justify-content-between"
              style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', cursor: 'pointer' }}
              onClick={() => handleSelect(() => onAskAi(query))}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-robot text-primary" style={{ fontSize: '18px' }} />
                <span>
                  Ask AI: <strong>"{query}"</strong>
                </span>
              </div>
              <span className="badge bg-primary">Enter ↵</span>
            </div>
          </div>
        )}

        <div className="search-results-list" style={{ maxHeight: '340px', overflowY: 'auto' }}>
          {/* Classes matches */}
          {matchedClasses.length > 0 && (
            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>
                Classes ({matchedClasses.length})
              </small>
              <div className="d-flex flex-column gap-1 mt-1">
                {matchedClasses.map((item) => (
                  <div
                    key={item._id || item.code}
                    className="p-2 rounded-2 d-flex align-items-center justify-content-between"
                    style={{ background: 'var(--bg-surface-elevated)', cursor: 'pointer' }}
                    onClick={() => handleSelect(() => onNavigate('timetable'))}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <div className="small text-muted">{item.code} · {item.time} · {item.room}</div>
                    </div>
                    <span className="badge bg-secondary">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes matches */}
          {matchedNotes.length > 0 && (
            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>
                Study Notes ({matchedNotes.length})
              </small>
              <div className="d-flex flex-column gap-1 mt-1">
                {matchedNotes.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-2 d-flex align-items-center justify-content-between"
                    style={{ background: 'var(--bg-surface-elevated)', cursor: 'pointer' }}
                    onClick={() => handleSelect(() => onNavigate('notes'))}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <div className="small text-muted">{item.category}</div>
                    </div>
                    <i className="bi bi-arrow-right text-muted" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments matches */}
          {matchedAssignments.length > 0 && (
            <div className="mb-3">
              <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>
                Assignments ({matchedAssignments.length})
              </small>
              <div className="d-flex flex-column gap-1 mt-1">
                {matchedAssignments.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-2 d-flex align-items-center justify-content-between"
                    style={{ background: 'var(--bg-surface-elevated)', cursor: 'pointer' }}
                    onClick={() => handleSelect(() => onNavigate('assignments'))}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <div className="small text-muted">{item.subject} · Due: {item.dueDate}</div>
                    </div>
                    <span className={`badge ${item.priority === 'High' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cleanQuery.length > 0 &&
            matchedClasses.length === 0 &&
            matchedNotes.length === 0 &&
            matchedAssignments.length === 0 && (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-search mb-2 d-block" style={{ fontSize: '24px' }} />
                <p>No local items match "{query}". Press Enter to ask AI.</p>
              </div>
            )}

          {cleanQuery.length === 0 && (
            <div className="p-2">
              <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '11px' }}>
                Quick Navigation
              </small>
              <div className="row g-2 mt-1">
                {[
                  { label: 'View Schedule', icon: 'bi-calendar3', screen: 'timetable' },
                  { label: 'Bunk-O-Meter', icon: 'bi-pie-chart-fill', screen: 'attendance' },
                  { label: 'AI Doubt Solver', icon: 'bi-robot', screen: 'assistant' },
                  { label: 'Assignments', icon: 'bi-check2-square', screen: 'assignments' },
                  { label: 'GPA Target Calculator', icon: 'bi-calculator', screen: 'cgpa' },
                  { label: 'Cheatsheets & Notes', icon: 'bi-journal-text', screen: 'notes' },
                ].map((quick) => (
                  <div className="col-6" key={quick.screen}>
                    <div
                      className="p-2 rounded-2 d-flex align-items-center gap-2"
                      style={{ background: 'var(--bg-surface-elevated)', cursor: 'pointer' }}
                      onClick={() => handleSelect(() => onNavigate(quick.screen))}
                    >
                      <i className={`bi ${quick.icon} text-primary`} />
                      <span className="small font-weight-bold">{quick.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
