import React, { useState } from 'react';

export default function AddNoteModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      category: 'General',
      tags: 'Exam, Revision',
      content: '',
      pinned: false,
    }
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please fill out Title and Content.');
      return;
    }
    const tagsArray = typeof formData.tags === 'string'
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : formData.tags;

    onSave({
      ...formData,
      tags: tagsArray,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h3 className="m-0" style={{ fontSize: '18px', fontWeight: '800' }}>
            <i className="bi bi-file-earmark-plus text-primary me-2" />
            {initialData ? 'Edit Study Note' : 'Create Study Note'}
          </h3>
          <button className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <label>Note Title</label>
            <input
              type="text"
              required
              className="form-input-custom"
              placeholder="e.g. Dynamic Programming Patterns & Memoization"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="row g-2">
            <div className="col-6 form-group-custom">
              <label>Subject / Category</label>
              <input
                type="text"
                className="form-input-custom"
                placeholder="e.g. DSA, DBMS, OS, AI"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="col-6 form-group-custom">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                className="form-input-custom"
                placeholder="e.g. Exam, Viva, Placement"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group-custom">
            <label>Content (Markdown supported)</label>
            <textarea
              required
              className="form-input-custom font-monospace"
              rows={8}
              placeholder="Write your notes, formulas, code snippets, or cheat sheet points..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="pinNoteCheck"
              checked={formData.pinned}
              onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
            />
            <label className="form-check-label small" htmlFor="pinNoteCheck">
              Pin this note to the top of my notes board
            </label>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
            <button type="button" className="btn-secondary-custom" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              <i className="bi bi-save" /> Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
