import React, { useState } from 'react';

export default function AddAssignmentModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      subject: '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: 'Medium',
      status: 'pending',
      notes: '',
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) {
      alert('Please fill out Title and Subject.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card-custom" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h3 className="m-0" style={{ fontSize: '18px', fontWeight: '800' }}>
            <i className="bi bi-journal-plus text-primary me-2" />
            {initialData ? 'Edit Assignment' : 'Add Assignment / Exam'}
          </h3>
          <button className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <label>Assignment / Exam Title</label>
            <input
              type="text"
              required
              className="form-input-custom"
              placeholder="e.g. DBMS Mini Project & Normalization Report"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="row g-2">
            <div className="col-6 form-group-custom">
              <label>Course / Subject Code</label>
              <input
                type="text"
                required
                className="form-input-custom"
                placeholder="e.g. CSE-302"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="col-6 form-group-custom">
              <label>Due Date</label>
              <input
                type="date"
                required
                className="form-input-custom"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="row g-2">
            <div className="col-6 form-group-custom">
              <label>Priority</label>
              <select
                className="form-input-custom"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">🔥 High Priority</option>
                <option value="Medium">⚡ Medium Priority</option>
                <option value="Low">🌱 Low Priority</option>
              </select>
            </div>
            <div className="col-6 form-group-custom">
              <label>Status</label>
              <select
                className="form-input-custom"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🚀 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group-custom">
            <label>Notes & Instructions</label>
            <textarea
              className="form-input-custom"
              rows={3}
              placeholder="Submission guidelines, syllabus details, group members, etc."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
            <button type="button" className="btn-secondary-custom" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              <i className="bi bi-check2-circle" /> Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
