import React, { useState } from 'react';

export default function ApproveLeavesView({
  leaves = [],
  onUpdateLeaveStatus,
  user,
  onToast,
}) {
  const [filter, setFilter] = useState('All'); // 'All' | 'pending' | 'approved' | 'rejected'
  const [facultyNoteInput, setFacultyNoteInput] = useState({});

  const filteredLeaves = leaves.filter((l) => {
    if (filter !== 'All' && l.status !== filter) return false;
    return true;
  });

  const handleAction = async (leaveId, status) => {
    const note = facultyNoteInput[leaveId] || (status === 'approved' ? 'Approved by Associate Professor' : 'Rejected');
    await onUpdateLeaveStatus(leaveId, {
      status,
      facultyNotes: note,
      reviewedBy: user?.name || 'Ajaz Hussain Warsi',
    });
    if (onToast) onToast(`Leave application ${status.toUpperCase()} successfully!`, status === 'approved' ? 'success' : 'info');
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-envelope-check-fill text-primary me-2" /> Student Leave Approvals
          </h2>
          <p className="text-muted small">
            Review and grant formal leaves submitted by students via AI Study Assistant
          </p>
        </div>

        <div className="btn-group btn-group-sm">
          {['All', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredLeaves.length === 0 ? (
        <div className="glass-card text-center py-5">
          <i className="bi bi-envelope-check text-muted" style={{ fontSize: '48px' }} />
          <h4 className="mt-3 font-weight-bold">No leave requests in this view</h4>
          <p className="text-muted small">All student leave submissions are caught up!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredLeaves.map((leave) => {
            const isPending = leave.status === 'pending';

            return (
              <div
                key={leave._id}
                className="glass-card p-4"
                style={{
                  borderLeft: `4px solid ${
                    leave.status === 'approved'
                      ? '#10b981'
                      : leave.status === 'rejected'
                      ? '#ef4444'
                      : '#f59e0b'
                  }`,
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-circle" style={{ width: '38px', height: '38px', fontSize: '13px' }}>
                      {leave.studentName?.[0] || 'S'}
                    </div>
                    <div>
                      <strong style={{ fontSize: '15px' }}>{leave.studentName}</strong>
                      <div className="small text-muted">
                        Roll: <span className="font-monospace text-primary">{leave.studentRoll}</span> · {leave.semester || '6th Semester'}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      leave.status === 'approved'
                        ? 'bg-success'
                        : leave.status === 'rejected'
                        ? 'bg-danger'
                        : 'bg-warning text-dark'
                    }`}
                  >
                    {leave.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-3 rounded-3 bg-surface-elevated border my-3">
                  <div className="small text-muted mb-1">
                    <i className="bi bi-calendar-range me-1 text-primary" />
                    <strong>Leave Period:</strong> {leave.startDate} to {leave.endDate}
                  </div>
                  <p className="m-0 text-muted" style={{ fontSize: '13px' }}>
                    <strong>Reason:</strong> {leave.reason}
                  </p>
                </div>

                {leave.facultyNotes && (
                  <div className="small text-muted mb-3 fst-italic">
                    <i className="bi bi-chat-left-quote me-1 text-primary" />
                    Faculty Remarks: "{leave.facultyNotes}" (Reviewed by {leave.reviewedBy || 'Faculty'})
                  </div>
                )}

                {isPending && (
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 pt-2 border-top">
                    <input
                      type="text"
                      className="form-control form-control-sm flex-1"
                      placeholder="Add optional faculty note / condition..."
                      value={facultyNoteInput[leave._id] || ''}
                      onChange={(e) => setFacultyNoteInput({ ...facultyNoteInput, [leave._id]: e.target.value })}
                    />

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-danger px-3"
                        onClick={() => handleAction(leave._id, 'rejected')}
                      >
                        <i className="bi bi-x-circle me-1" /> Reject
                      </button>
                      <button
                        className="btn btn-sm btn-success px-4"
                        onClick={() => handleAction(leave._id, 'approved')}
                      >
                        <i className="bi bi-check-circle-fill me-1" /> Approve Leave
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
