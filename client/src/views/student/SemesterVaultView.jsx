import React, { useState, useMemo } from 'react';
import { SEMESTER_CURRICULUM, getSubjectsForSemester } from '../../services/academicCurriculum';

export default function SemesterVaultView({
  resources = [],
  bookmarks = [],
  onToggleBookmark,
  onOpenPreview,
  onOpenUpload,
  user,
}) {
  const [selectedSemester, setSelectedSemester] = useState(user?.role === 'student' ? (user.semester || 6) : 6);
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'Note' | 'Assignment' | 'PYQ'
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const isFaculty = user?.role === 'faculty';
  const subjectsList = useMemo(() => getSubjectsForSemester(selectedSemester), [selectedSemester]);

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      if (res.semester !== Number(selectedSemester)) return false;
      if (selectedType !== 'All' && res.resourceType !== selectedType) return false;
      if (selectedSubject !== 'All' && res.subject !== selectedSubject) return false;
      if (showBookmarksOnly && !bookmarks.includes(res._id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          res.title?.toLowerCase().includes(q) ||
          res.subject?.toLowerCase().includes(q) ||
          res.code?.toLowerCase().includes(q) ||
          res.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [resources, selectedSemester, selectedType, selectedSubject, showBookmarksOnly, bookmarks, searchQuery]);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header & Upload Button */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-mortarboard-fill text-primary me-2" /> 1st to 8th Semester Academic Vault
          </h2>
          <p className="text-muted small">
            Curated lecture notes, cheatsheets, lab assignments, and solved previous year question papers (PYQs)
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {isFaculty && (
            <button className="btn-primary-custom py-2 px-3" onClick={() => onOpenUpload(selectedSemester)}>
              <i className="bi bi-cloud-arrow-up me-1" /> Upload to Sem {selectedSemester}
            </button>
          )}

          <button
            className={`btn btn-sm ${showBookmarksOnly ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          >
            <i className={`bi ${showBookmarksOnly ? 'bi-bookmark-star-fill' : 'bi-bookmark'} me-1`} />
            Saved ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* 1st to 8th Semester Tabs */}
      <div className="day-tabs-container mb-0 pb-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <button
            key={sem}
            className={`day-tab-btn ${selectedSemester === sem ? 'active' : ''}`}
            onClick={() => {
              setSelectedSemester(sem);
              setSelectedSubject('All');
            }}
          >
            Sem {sem} {user?.semester === sem && '⭐'}
          </button>
        ))}
      </div>

      {/* Filters Bar: Resource Type, Subject, and Search */}
      <div className="glass-card p-3">
        <div className="row g-2 align-items-center">
          {/* Resource Type Tabs */}
          <div className="col-12 col-lg-5">
            <div className="btn-group btn-group-sm w-100">
              {[
                { id: 'All', label: 'All Items', icon: 'bi-grid' },
                { id: 'Note', label: 'Lecture Notes', icon: 'bi-file-text' },
                { id: 'Assignment', label: 'Assignments', icon: 'bi-journal-check' },
                { id: 'PYQ', label: 'Solved PYQs', icon: 'bi-patch-question' },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`btn ${selectedType === t.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedType(t.id)}
                >
                  <i className={`bi ${t.icon} me-1`} /> {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Dropdown */}
          <div className="col-12 col-md-6 col-lg-4">
            <select
              className="form-select form-select-sm"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects ({subjectsList.length})</option>
              {subjectsList.map((s) => (
                <option key={s.code} value={s.name}>
                  {s.code} · {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-surface-elevated border-end-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-surface-elevated border-start-0"
                placeholder="Search notes, PYQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="glass-card text-center py-5">
          <i className="bi bi-folder-x text-muted" style={{ fontSize: '48px' }} />
          <h4 className="mt-3 font-weight-bold">No resources found for Semester {selectedSemester}</h4>
          <p className="text-muted small">
            {isFaculty ? 'You can upload lecture notes, assignments, or PYQs for this semester.' : 'Check back soon or ask in the Community Forum!'}
          </p>
          {isFaculty && (
            <button className="btn-primary-custom mt-2" onClick={() => onOpenUpload(selectedSemester)}>
              <i className="bi bi-cloud-arrow-up me-1" /> Upload Resource
            </button>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {filteredResources.map((item) => {
            const isBookmarked = bookmarks.includes(item._id);

            return (
              <div className="col-12 col-md-6 col-lg-4" key={item._id}>
                <div
                  className="glass-card h-100 d-flex flex-column justify-content-between p-3"
                  style={{
                    borderTop: `3px solid ${
                      item.resourceType === 'Note'
                        ? '#6366f1'
                        : item.resourceType === 'PYQ'
                        ? '#f59e0b'
                        : '#10b981'
                    }`,
                    cursor: 'pointer',
                  }}
                  onClick={() => onOpenPreview(item)}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span
                        className={`badge ${
                          item.resourceType === 'Note'
                            ? 'bg-primary'
                            : item.resourceType === 'PYQ'
                            ? 'bg-warning text-dark'
                            : 'bg-success'
                        }`}
                        style={{ fontSize: '11px' }}
                      >
                        <i
                          className={`bi ${
                            item.resourceType === 'Note'
                              ? 'bi-file-text'
                              : item.resourceType === 'PYQ'
                              ? 'bi-patch-question'
                              : 'bi-journal-check'
                          } me-1`}
                        />
                        {item.resourceType}
                      </span>

                      <button
                        className={`btn btn-sm p-0 ${isBookmarked ? 'text-warning' : 'text-muted'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(item._id);
                        }}
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      >
                        <i className={`bi ${isBookmarked ? 'bi-bookmark-star-fill' : 'bi-bookmark'}`} />
                      </button>
                    </div>

                    <h4 style={{ fontSize: '15px', fontWeight: '800' }} className="mb-2">
                      {item.title}
                    </h4>

                    <div className="small text-muted mb-2">
                      <div><i className="bi bi-book me-1 text-primary" /> {item.subject}</div>
                      {item.examYear && (
                        <div className="text-warning mt-1"><i className="bi bi-calendar-event me-1" /> {item.examYear} (Solved)</div>
                      )}
                    </div>

                    <p
                      className="small text-muted mb-3"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.description || item.content?.replace(/[#*`$]/g, '')}
                    </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top small text-muted">
                    <span>By: {item.uploadedBy?.name || 'Faculty'}</span>
                    <span className="badge bg-surface-elevated text-primary border">
                      <i className="bi bi-eye me-1" /> Read / Download
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
