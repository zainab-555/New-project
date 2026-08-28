import React, { useState } from 'react';

export default function TimetableView({
  classes = [],
  onOpenAddClass,
  onDeleteClass,
  onRefresh,
  loading = false,
}) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'All'];
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const filteredClasses = classes.filter((c) => {
    if (selectedDay === 'All') return true;
    return c.day === selectedDay;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(classes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `timetable-${selectedDay.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Bar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-calendar3 text-primary me-2" /> Weekly Timetable & Classes
          </h2>
          <p className="text-muted small">Manage your college schedule, labs, lecture halls, and professors</p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onRefresh}
            disabled={loading}
            title="Sync with Backend"
          >
            <i className={`bi bi-arrow-clockwise me-1 ${loading ? 'spin' : ''}`} /> Refresh
          </button>

          <button className="btn btn-sm btn-outline-secondary" onClick={handleExportJson} title="Export Timetable">
            <i className="bi bi-download me-1" /> Export
          </button>

          <button className="btn btn-sm btn-outline-secondary" onClick={handlePrint} title="Print Timetable">
            <i className="bi bi-printer me-1" /> Print
          </button>

          <button className="btn-primary-custom py-2 px-3" onClick={onOpenAddClass}>
            <i className="bi bi-plus-lg" /> Add Class
          </button>
        </div>
      </div>

      {/* Day Filter Tabs */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="day-tabs-container mb-0">
          {days.map((day) => (
            <button
              key={day}
              className={`day-tab-btn ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day === 'All' ? 'All Week' : day}
            </button>
          ))}
        </div>

        <div className="btn-group btn-group-sm">
          <button
            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <i className="bi bi-list-ul" />
          </button>
          <button
            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <i className="bi bi-grid-fill" />
          </button>
        </div>
      </div>

      {/* Classes Content */}
      {filteredClasses.length === 0 ? (
        <div className="glass-card text-center py-5">
          <i className="bi bi-calendar-x text-muted" style={{ fontSize: '48px' }} />
          <h3 className="mt-3 mb-1 font-weight-bold">No classes for {selectedDay}</h3>
          <p className="text-muted small">You can add your lecture, lab, or tutorial slot for this day.</p>
          <button className="btn-primary-custom mt-2" onClick={onOpenAddClass}>
            <i className="bi bi-plus-lg" /> Add Class to {selectedDay}
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="d-flex flex-column gap-2">
          {filteredClasses.map((item) => (
            <div key={item._id || item.code} className="class-card-item">
              <div className="class-time-block">
                <strong>{item.time}</strong>
                <span className="badge bg-secondary mt-1">{item.day}</span>
              </div>
              <div className="class-info-block">
                <h4>{item.title}</h4>
                <div className="class-meta">
                  <span><i className="bi bi-geo-alt" /> {item.room || 'LH-101'}</span>
                  {item.instructor && <span><i className="bi bi-person" /> {item.instructor}</span>}
                  <span className="text-muted"><i className="bi bi-hash" /> {item.code}</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className={`class-tone-pill tone-${item.tone || 'indigo'}`}>
                  {item.code}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDeleteClass(item._id || item.id || item.code)}
                  title="Delete Class"
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-3">
          {filteredClasses.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item._id || item.code}>
              <div className="glass-card h-100 d-flex flex-column justify-content-between p-3">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-primary">{item.day} · {item.time}</span>
                    <span className={`class-tone-pill tone-${item.tone || 'indigo'}`}>
                      {item.code}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }} className="mb-2">
                    {item.title}
                  </h4>
                  <div className="small text-muted mb-2">
                    <div><i className="bi bi-geo-alt me-1" /> Room: {item.room || 'TBD'}</div>
                    {item.instructor && <div><i className="bi bi-person me-1" /> Prof: {item.instructor}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end pt-2 border-top">
                  <button
                    className="btn btn-sm btn-outline-danger py-0 px-2"
                    onClick={() => onDeleteClass(item._id || item.id || item.code)}
                    title="Delete Class"
                  >
                    <i className="bi bi-trash3 me-1" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
