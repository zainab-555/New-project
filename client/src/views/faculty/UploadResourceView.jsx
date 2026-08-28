import React, { useState, useMemo } from 'react';
import { getSubjectsForSemester } from '../../services/academicCurriculum';

export default function UploadResourceView({
  initialSemester = 6,
  onUploadResource,
  user,
  onToast,
}) {
  const [semester, setSemester] = useState(initialSemester || 6);
  const subjects = useMemo(() => getSubjectsForSemester(semester), [semester]);

  const [formData, setFormData] = useState({
    title: '',
    resourceType: 'Note',
    subject: subjects[0]?.name || 'Full Stack Web Development (MERN Stack)',
    code: subjects[0]?.code || 'CSE-601',
    description: '',
    content: '',
    fileUrl: '',
    examYear: '2025 End-Sem',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill out Title and Content.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        semester: Number(semester),
        uploadedBy: {
          name: user?.name || 'Faculty',
          role: 'faculty',
          id: user?.id || user?.facultyId || 'FAC-01',
        },
      };
      await onUploadResource(payload);
      if (onToast) onToast(`Resource published to Semester ${semester} Vault!`, 'success');
      setFormData({
        title: '',
        resourceType: 'Note',
        subject: subjects[0]?.name || '',
        code: subjects[0]?.code || '',
        description: '',
        content: '',
        fileUrl: '',
        examYear: '2025 End-Sem',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
          <i className="bi bi-cloud-arrow-up-fill text-primary me-2" /> Upload Academic Vault Resource
        </h2>
        <p className="text-muted small">
          Publish Lecture Notes, Assignments, or Solved PYQs tagged to Semesters 1 to 8
        </p>
      </div>

      <div className="glass-card p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6 form-group-custom">
              <label>Target Semester</label>
              <select
                className="form-input-custom"
                value={semester}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  setSemester(s);
                  const subjs = getSubjectsForSemester(s);
                  if (subjs.length > 0) {
                    setFormData((prev) => ({ ...prev, subject: subjs[0].name, code: subjs[0].code }));
                  }
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 form-group-custom">
              <label>Resource Category</label>
              <select
                className="form-input-custom"
                value={formData.resourceType}
                onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
              >
                <option value="Note">📝 Lecture Note / Cheatsheet</option>
                <option value="Assignment">📅 Homework / Lab Assignment</option>
                <option value="PYQ">📄 Solved Previous Year Paper (PYQ)</option>
              </select>
            </div>

            <div className="col-12 col-md-8 form-group-custom">
              <label>Subject</label>
              <select
                className="form-input-custom"
                value={formData.subject}
                onChange={(e) => {
                  const subjObj = subjects.find((s) => s.name === e.target.value);
                  setFormData({
                    ...formData,
                    subject: e.target.value,
                    code: subjObj?.code || '',
                  });
                }}
              >
                {subjects.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.code} · {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4 form-group-custom">
              <label>{formData.resourceType === 'PYQ' ? 'Exam Session / Year' : 'Course Code'}</label>
              <input
                type="text"
                className="form-input-custom"
                placeholder={formData.resourceType === 'PYQ' ? 'e.g. 2025 Mid-Sem' : 'CSE-601'}
                value={formData.resourceType === 'PYQ' ? formData.examYear : formData.code}
                onChange={(e) =>
                  setFormData(
                    formData.resourceType === 'PYQ'
                      ? { ...formData, examYear: e.target.value }
                      : { ...formData, code: e.target.value }
                  )
                }
              />
            </div>

            <div className="col-12 form-group-custom">
              <label>Resource Title</label>
              <input
                type="text"
                required
                className="form-input-custom"
                placeholder="e.g. B+ Tree Indexing & ACID Transactions Solved Notes"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="col-12 form-group-custom">
              <label>Short Description</label>
              <input
                type="text"
                className="form-input-custom"
                placeholder="Key highlights, exam significance, or chapter summary..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="col-12 form-group-custom">
              <label>Document Content / Notes Body (Markdown supported)</label>
              <textarea
                required
                rows={10}
                className="form-input-custom font-monospace"
                placeholder="Write or paste your lecture notes, equations, code examples, or PYQ solutions in Markdown format..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <div className="col-12 form-group-custom">
              <label>External PDF / Drive Download Link (Optional)</label>
              <input
                type="url"
                className="form-input-custom"
                placeholder="https://drive.google.com/..."
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="submit" className="btn-primary-custom py-2 px-4" disabled={loading}>
              {loading ? 'Publishing...' : <><i className="bi bi-cloud-arrow-up-fill" /> Publish to Vault</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
