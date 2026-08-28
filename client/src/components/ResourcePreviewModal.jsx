import React from 'react';

export default function ResourcePreviewModal({
  resource,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onToast,
}) {
  if (!isOpen || !resource) return null;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(resource.content || resource.description || '');
    if (onToast) onToast('Resource content copied to clipboard!', 'success');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([resource.content || resource.description || ''], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${resource.code || 'CSE'}-${resource.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    element.remove();
    if (onToast) onToast('Download started!', 'success');
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-card-custom" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        {/* Modal Header */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
          <div className="d-flex align-items-center gap-2">
            <span
              className={`badge ${
                resource.resourceType === 'Note'
                  ? 'bg-primary'
                  : resource.resourceType === 'PYQ'
                  ? 'bg-warning text-dark'
                  : 'bg-success'
              }`}
              style={{ fontSize: '11px' }}
            >
              {resource.resourceType}
            </span>
            <span className="badge bg-secondary">Sem {resource.semester}</span>
            <span className="small text-muted font-monospace">{resource.code}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn btn-sm ${isBookmarked ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
              onClick={() => onToggleBookmark(resource._id)}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this resource'}
            >
              <i className={`bi ${isBookmarked ? 'bi-bookmark-star-fill' : 'bi-bookmark'}`} />
            </button>
            <button className="btn-close" onClick={onClose} />
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="mb-3">
          <h3 style={{ fontSize: '18px', fontWeight: '800' }} className="mb-2">
            {resource.title}
          </h3>
          <div className="d-flex flex-wrap align-items-center gap-3 small text-muted">
            <span><i className="bi bi-book me-1 text-primary" /> {resource.subject}</span>
            <span><i className="bi bi-person me-1" /> By: {resource.uploadedBy?.name || 'Faculty'}</span>
            {resource.examYear && <span><i className="bi bi-calendar me-1 text-warning" /> Exam: {resource.examYear}</span>}
            <span><i className="bi bi-download me-1" /> {resource.downloadsCount || 0} Downloads</span>
          </div>
        </div>

        {/* Content Viewer / Markdown Preview */}
        <div
          className="p-3 rounded-3 bg-surface-elevated border mb-3 font-monospace"
          style={{ maxHeight: '420px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '13px' }}
        >
          {resource.content || resource.description || 'No direct content available. Click download to fetch source.'}
        </div>

        {/* Action Footer */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top">
          <button className="btn btn-outline-secondary btn-sm" onClick={handleCopyContent}>
            <i className="bi bi-clipboard me-1" /> Copy Markdown
          </button>

          <div className="d-flex gap-2">
            <button className="btn-secondary-custom" onClick={onClose}>
              Close
            </button>
            <button className="btn-primary-custom" onClick={handleDownload}>
              <i className="bi bi-download" /> Download Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
