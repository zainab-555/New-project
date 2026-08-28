import React, { useState } from 'react';

export default function CreatePostModal({
  isOpen,
  onClose,
  onSave,
  user,
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    semesterTag: user?.role === 'student' ? `Sem ${user.semester || 6}` : 'General',
    categoryTag: user?.role === 'faculty' ? 'Announcement' : 'Doubt',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isFaculty = user?.role === 'faculty';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill out Title and Content.');
      return;
    }
    setLoading(true);
    try {
      await onSave({
        ...formData,
        authorName: user?.name || (isFaculty ? 'Faculty' : 'Student'),
        authorId: user?.id || user?.enrollmentNo || user?.facultyId || 'U-01',
        authorRole: user?.role || 'student',
        authorDept: isFaculty ? (user?.department || 'CSE') : `${user?.branch || 'CSE'} Sem ${user?.semester || 6}`,
        isAnnouncement: isFaculty && formData.categoryTag === 'Announcement',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="d-flex align-items-center justify-content-between pb-2 border-bottom mb-3">
          <h3 className="m-0" style={{ fontSize: '18px', fontWeight: '800' }}>
            <i className={`bi ${isFaculty ? 'bi-megaphone-fill text-warning' : 'bi-chat-square-dots-fill text-primary'} me-2`} />
            {isFaculty ? 'Post Faculty Announcement or Discussion' : 'Ask Academic Doubt or Start Discussion'}
          </h3>
          <button className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          {isFaculty && (
            <div className="alert alert-warning py-2 small d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-patch-check-fill text-primary" style={{ fontSize: '16px' }} />
              <span>Posts by faculty will automatically carry the <strong>Verified Faculty</strong> badge.</span>
            </div>
          )}

          <div className="form-group-custom">
            <label>Discussion Title</label>
            <input
              type="text"
              required
              className="form-input-custom"
              placeholder={isFaculty ? 'e.g. 📢 Mid-Term Exam Syllabus & Instructions' : 'e.g. ❓ How to solve B+ Tree splitting overflow?'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="row g-2">
            <div className="col-6 form-group-custom">
              <label>Semester Channel</label>
              <select
                className="form-input-custom"
                value={formData.semesterTag}
                onChange={(e) => setFormData({ ...formData, semesterTag: e.target.value })}
              >
                <option value="General">🌐 General Campus Feed</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={`Sem ${s}`}>
                    📚 Semester {s} Channel
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 form-group-custom">
              <label>Category Tag</label>
              <select
                className="form-input-custom"
                value={formData.categoryTag}
                onChange={(e) => setFormData({ ...formData, categoryTag: e.target.value })}
              >
                {isFaculty && <option value="Announcement">📢 Verified Announcement</option>}
                <option value="Doubt">❓ Academic Doubt</option>
                <option value="Project">🚀 Project Collaboration</option>
                <option value="ExamPrep">📝 Exam & Viva Tips</option>
              </select>
            </div>
          </div>

          <div className="form-group-custom">
            <label>Content (Markdown & code snippets supported)</label>
            <textarea
              required
              rows={7}
              className="form-input-custom font-monospace"
              placeholder="Describe your query, question, or announcement details clearly..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <button type="button" className="btn-secondary-custom" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom" disabled={loading}>
              {loading ? 'Publishing...' : <><i className="bi bi-send-fill" /> Publish Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
