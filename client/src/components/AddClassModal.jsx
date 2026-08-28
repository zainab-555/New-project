import React, { useState } from 'react';

export default function AddClassModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      code: '',
      time: '09:00 AM',
      room: 'LH-101',
      day: 'Mon',
      instructor: '',
      tone: 'indigo',
    }
  );

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.time) {
      alert('Please fill out Title, Code, and Time.');
      return;
    }
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card-custom" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h3 className="m-0" style={{ fontSize: '18px', fontWeight: '800' }}>
            <i className="bi bi-calendar-plus text-primary me-2" />
            {initialData ? 'Edit Class' : 'Add New Class'}
          </h3>
          <button className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <label>Subject / Course Name</label>
            <input
              type="text"
              required
              className="form-input-custom"
              placeholder="e.g. Data Structures & Algorithms"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="row g-2">
            <div className="col-6 form-group-custom">
              <label>Course Code</label>
              <input
                type="text"
                required
                className="form-input-custom"
                placeholder="e.g. CSE-301"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div className="col-6 form-group-custom">
              <label>Day of Week</label>
              <select
                className="form-input-custom"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              >
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-6 form-group-custom">
              <label>Class Time</label>
              <input
                type="text"
                required
                className="form-input-custom"
                placeholder="e.g. 09:00 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div className="col-6 form-group-custom">
              <label>Room / Hall</label>
              <input
                type="text"
                className="form-input-custom"
                placeholder="e.g. LH-102 / Lab 3"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </div>
          </div>

          <div className="row g-2">
            <div className="col-6 form-group-custom">
              <label>Professor / Instructor</label>
              <input
                type="text"
                className="form-input-custom"
                placeholder="e.g. Dr. Sharma"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              />
            </div>
            <div className="col-6 form-group-custom">
              <label>Color Theme</label>
              <select
                className="form-input-custom"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              >
                <option value="indigo">Indigo Violet</option>
                <option value="emerald">Emerald Mint</option>
                <option value="amber">Amber Gold</option>
                <option value="rose">Rose Coral</option>
                <option value="cyan">Cyan Aqua</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
            <button type="button" className="btn-secondary-custom" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" /> Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle" /> Save Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
