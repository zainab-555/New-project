import React, { useState } from 'react';

export default function AssignmentsView({
  assignments = [],
  onOpenAddAssignment,
  onUpdateAssignments,
}) {
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'

  const filtered = assignments.filter((item) => {
    if (filterPriority !== 'All' && item.priority !== filterPriority) return false;
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    return true;
  });

  const handleStatusChange = (id, newStatus) => {
    const updated = assignments.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    onUpdateAssignments(updated);
  };

  const handleDelete = (id) => {
    onUpdateAssignments(assignments.filter((a) => a.id !== id));
  };

  const getDaysRemaining = (dueDateStr) => {
    if (!dueDateStr) return 'No date';
    const due = new Date(dueDateStr);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    if (diffDays === 0) return 'Due Today!';
    return `${diffDays}d left`;
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-check2-square text-primary me-2" /> Assignments, Projects & Exams
          </h2>
          <p className="text-muted small">Track coursework submissions, lab reports, and upcoming exam dates</p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <select
            className="form-select form-select-sm"
            style={{ width: '130px' }}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">🔥 High</option>
            <option value="Medium">⚡ Medium</option>
            <option value="Low">🌱 Low</option>
          </select>

          <div className="btn-group btn-group-sm">
            <button
              className={`btn ${viewMode === 'kanban' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
            >
              <i className="bi bi-kanban" />
            </button>
            <button
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <i className="bi bi-list-task" />
            </button>
          </div>

          <button className="btn-primary-custom py-2 px-3" onClick={onOpenAddAssignment}>
            <i className="bi bi-plus-lg" /> Add Assignment
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="row g-4">
          {/* Pending Column */}
          <div className="col-12 col-md-4">
            <div className="glass-card p-3 h-100" style={{ background: 'var(--bg-surface-elevated)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <strong style={{ fontSize: '14px' }}>
                  <i className="bi bi-hourglass-split text-warning me-1" /> Pending (
                  {filtered.filter((a) => a.status === 'pending').length})
                </strong>
              </div>

              <div className="d-flex flex-column gap-2">
                {filtered
                  .filter((a) => a.status === 'pending')
                  .map((item) => (
                    <div key={item.id} className="p-3 rounded-3 bg-surface border shadow-sm">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-secondary">{item.subject}</span>
                        <span
                          className={`badge ${
                            item.priority === 'High'
                              ? 'bg-danger'
                              : item.priority === 'Medium'
                              ? 'bg-warning text-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700' }} className="mb-2">
                        {item.title}
                      </h4>
                      {item.notes && <p className="small text-muted mb-2">{item.notes}</p>}
                      <div className="d-flex align-items-center justify-content-between pt-2 border-top small text-muted">
                        <span>
                          <i className="bi bi-clock me-1" />
                          {getDaysRemaining(item.dueDate)}
                        </span>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary py-0 px-2"
                            onClick={() => handleStatusChange(item.id, 'in-progress')}
                            title="Move to In Progress"
                          >
                            &rarr; Start
                          </button>
                          <button
                            className="btn btn-sm text-danger p-0"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* In Progress Column */}
          <div className="col-12 col-md-4">
            <div className="glass-card p-3 h-100" style={{ background: 'var(--bg-surface-elevated)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <strong style={{ fontSize: '14px' }}>
                  <i className="bi bi-lightning-charge-fill text-primary me-1" /> In Progress (
                  {filtered.filter((a) => a.status === 'in-progress').length})
                </strong>
              </div>

              <div className="d-flex flex-column gap-2">
                {filtered
                  .filter((a) => a.status === 'in-progress')
                  .map((item) => (
                    <div key={item.id} className="p-3 rounded-3 bg-surface border shadow-sm">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-primary">{item.subject}</span>
                        <span
                          className={`badge ${
                            item.priority === 'High'
                              ? 'bg-danger'
                              : item.priority === 'Medium'
                              ? 'bg-warning text-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '700' }} className="mb-2">
                        {item.title}
                      </h4>
                      {item.notes && <p className="small text-muted mb-2">{item.notes}</p>}
                      <div className="d-flex align-items-center justify-content-between pt-2 border-top small text-muted">
                        <span>
                          <i className="bi bi-clock me-1" />
                          {getDaysRemaining(item.dueDate)}
                        </span>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-success py-0 px-2"
                            onClick={() => handleStatusChange(item.id, 'completed')}
                            title="Mark Completed"
                          >
                            ✓ Done
                          </button>
                          <button
                            className="btn btn-sm text-danger p-0"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Completed Column */}
          <div className="col-12 col-md-4">
            <div className="glass-card p-3 h-100" style={{ background: 'var(--bg-surface-elevated)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <strong style={{ fontSize: '14px' }}>
                  <i className="bi bi-check-circle-fill text-success me-1" /> Submitted / Done (
                  {filtered.filter((a) => a.status === 'completed').length})
                </strong>
              </div>

              <div className="d-flex flex-column gap-2">
                {filtered
                  .filter((a) => a.status === 'completed')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-3 bg-surface border opacity-75 shadow-sm"
                      style={{ textDecoration: 'line-through' }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-success">{item.subject}</span>
                        <span className="badge bg-secondary">Done</span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600' }} className="mb-1 text-muted">
                        {item.title}
                      </h4>
                      <div className="d-flex align-items-center justify-content-between pt-2 border-top small text-muted">
                        <span>Submitted</span>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-secondary py-0 px-2"
                            onClick={() => handleStatusChange(item.id, 'pending')}
                            title="Reopen"
                          >
                            Undo
                          </button>
                          <button
                            className="btn btn-sm text-danger p-0"
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="d-flex flex-column gap-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="class-card-item justify-content-between"
              style={{ opacity: item.status === 'completed' ? 0.6 : 1 }}
            >
              <div className="d-flex align-items-center gap-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  checked={item.status === 'completed'}
                  onChange={(e) => handleStatusChange(item.id, e.target.checked ? 'completed' : 'pending')}
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }} className={item.status === 'completed' ? 'text-decoration-line-through' : ''}>
                    {item.title}
                  </h4>
                  <div className="class-meta">
                    <span><i className="bi bi-book" /> {item.subject}</span>
                    <span><i className="bi bi-calendar" /> Due: {item.dueDate} ({getDaysRemaining(item.dueDate)})</span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className={`badge ${item.priority === 'High' ? 'bg-danger' : item.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                  {item.priority}
                </span>
                <button className="btn btn-sm text-danger" onClick={() => handleDelete(item.id)}>
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
