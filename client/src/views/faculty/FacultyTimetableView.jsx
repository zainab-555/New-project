import React, { useState } from 'react';

export default function FacultyTimetableView({
  classes = [],
  onOpenAddClass,
  onDeleteClass,
}) {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'All'];

  const filtered = classes.filter((c) => {
    if (selectedDay === 'All') return true;
    return c.day === selectedDay;
  });

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-calendar-week-fill text-primary me-2" /> Faculty Teaching Timetable
          </h2>
          <p className="text-muted small">
            Weekly lecture hours, room allocations, and lab slots assigned to you
          </p>
        </div>

        <button className="btn-primary-custom py-2 px-3" onClick={onOpenAddClass}>
          <i className="bi bi-plus-lg" /> Add Teaching Slot
        </button>
      </div>

      <div className="day-tabs-container mb-0 pb-1">
        {days.map((d) => (
          <button
            key={d}
            className={`day-tab-btn ${selectedDay === d ? 'active' : ''}`}
            onClick={() => setSelectedDay(d)}
          >
            {d === 'All' ? 'All Week' : d}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card text-center py-5">
          <i className="bi bi-calendar-check text-muted" style={{ fontSize: '48px' }} />
          <h4 className="mt-3 font-weight-bold">No teaching slots on {selectedDay}</h4>
          <p className="text-muted small">Enjoy your preparation time or add a new lecture slot.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {filtered.map((item) => (
            <div key={item._id || item.code} className="class-card-item justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="class-time-block">
                  <strong>{item.time}</strong>
                  <span className="badge bg-secondary mt-1">{item.day}</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }} className="m-0">
                    {item.title}
                  </h4>
                  <div className="class-meta mt-1">
                    <span><i className="bi bi-geo-alt" /> Room: {item.room || 'LH-101'}</span>
                    <span><i className="bi bi-hash" /> {item.code}</span>
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className={`class-tone-pill tone-${item.tone || 'indigo'}`}>
                  {item.code}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDeleteClass(item._id || item.id || item.code)}
                  title="Remove Slot"
                >
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
