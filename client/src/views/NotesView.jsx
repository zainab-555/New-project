import React, { useState } from 'react';

export default function NotesView({
  notes = [],
  onOpenAddNote,
  onUpdateNotes,
  onToast,
}) {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'cheatsheets'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCheatsheet, setActiveCheatsheet] = useState('sql');

  const categories = ['All', ...Array.from(new Set(notes.map((n) => n.category).filter(Boolean)))];

  const filteredNotes = notes.filter((n) => {
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title?.toLowerCase().includes(q) ||
        n.category?.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTogglePin = (id) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    onUpdateNotes(updated);
  };

  const handleDeleteNote = (id) => {
    onUpdateNotes(notes.filter((n) => n.id !== id));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    if (onToast) onToast('Note copied to clipboard!', 'success');
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-journal-text text-primary me-2" /> Study Notes & Engineering Cheatsheets
          </h2>
          <p className="text-muted small">Revision summaries, algorithms, exam notes, and standard cheatsheets</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="btn-group">
            <button
              className={`btn btn-sm ${activeTab === 'notes' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('notes')}
            >
              <i className="bi bi-journals me-1" /> My Notes
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'cheatsheets' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveTab('cheatsheets')}
            >
              <i className="bi bi-file-earmark-code me-1" /> Cheatsheets
            </button>
          </div>

          {activeTab === 'notes' && (
            <button className="btn-primary-custom py-2 px-3" onClick={onOpenAddNote}>
              <i className="bi bi-plus-lg" /> New Note
            </button>
          )}
        </div>
      </div>

      {activeTab === 'notes' ? (
        <>
          {/* Search & Categories */}
          <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
            <div className="input-group" style={{ maxWidth: '380px' }}>
              <span className="input-group-text bg-surface-elevated border-end-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-surface-elevated border-start-0"
                placeholder="Search notes or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="d-flex gap-1 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Grid */}
          {filteredNotes.length === 0 ? (
            <div className="glass-card text-center py-5">
              <i className="bi bi-journal-x text-muted" style={{ fontSize: '40px' }} />
              <h4 className="mt-3 font-weight-bold">No notes found</h4>
              <p className="text-muted small">Create your first study note or change search filter.</p>
              <button className="btn-primary-custom mt-2" onClick={onOpenAddNote}>
                <i className="bi bi-plus-lg" /> Create Note
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {filteredNotes.map((note) => (
                <div className="col-12 col-md-6 col-lg-4" key={note.id}>
                  <div
                    className="glass-card h-100 d-flex flex-column justify-content-between p-3"
                    style={{ borderTop: note.pinned ? '3px solid var(--primary)' : '1px solid var(--border-subtle)' }}
                  >
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-primary">{note.category}</span>
                        <div className="d-flex gap-1">
                          <button
                            className={`btn btn-sm p-0 ${note.pinned ? 'text-warning' : 'text-muted'}`}
                            onClick={() => handleTogglePin(note.id)}
                            title={note.pinned ? 'Unpin' : 'Pin Note'}
                          >
                            <i className={`bi ${note.pinned ? 'bi-pin-fill' : 'bi-pin'}`} />
                          </button>
                          <button
                            className="btn btn-sm text-danger p-0 ms-2"
                            onClick={() => handleDeleteNote(note.id)}
                            title="Delete Note"
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: '800' }} className="mb-2">
                        {note.title}
                      </h4>

                      <div
                        className="small text-muted mb-3 font-monospace"
                        style={{
                          whiteSpace: 'pre-wrap',
                          maxHeight: '160px',
                          overflowY: 'auto',
                          lineHeight: '1.5',
                        }}
                      >
                        {note.content}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between pt-2 border-top small text-muted">
                      <span>Updated: {note.updatedAt || 'Recent'}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        onClick={() => handleCopy(note.content)}
                      >
                        <i className="bi bi-clipboard me-1" /> Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Built-in Engineering Cheatsheets */
        <div className="glass-card">
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {[
              { id: 'sql', label: 'SQL Commands', icon: 'bi-database' },
              { id: 'git', label: 'Git Cheatsheet', icon: 'bi-git' },
              { id: 'dsa', label: 'Big-O Complexities', icon: 'bi-speedometer2' },
              { id: 'http', label: 'HTTP Status Codes', icon: 'bi-globe' },
            ].map((cs) => (
              <button
                key={cs.id}
                className={`btn btn-sm ${activeCheatsheet === cs.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setActiveCheatsheet(cs.id)}
              >
                <i className={`bi ${cs.icon} me-1`} /> {cs.label}
              </button>
            ))}
          </div>

          {activeCheatsheet === 'sql' && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800' }}>🗄️ SQL Essential Queries Cheat Sheet</h3>
              <pre className="p-3 bg-dark text-light rounded-3 mt-3 font-monospace small">
{`-- 1. Create Table with Foreign Key
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  dept_id INT,
  FOREIGN KEY (dept_id) REFERENCES departments(id)
);

-- 2. Aggregate & Grouping Query
SELECT dept_id, COUNT(*) as student_count, AVG(gpa) as avg_gpa
FROM students
GROUP BY dept_id
HAVING avg_gpa >= 7.5
ORDER BY avg_gpa DESC;

-- 3. Inner vs Left Join
SELECT s.name, d.dept_name
FROM students s
LEFT JOIN departments d ON s.dept_id = d.id;

-- 4. Transaction (ACID)
START TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;`}
              </pre>
            </div>
          )}

          {activeCheatsheet === 'git' && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800' }}>🐙 Git & GitHub Commands Cheat Sheet</h3>
              <pre className="p-3 bg-dark text-light rounded-3 mt-3 font-monospace small">
{`# 1. Branching & Checkout
git checkout -b feature/college-portal    # Create & switch
git branch -a                             # List all branches

# 2. Staging & Committing
git add .
git commit -m "feat: add timetable and attendance tracker"

# 3. Remote Sync & Rebasing
git pull --rebase origin main
git push origin feature/college-portal

# 4. Undo Changes Safely
git restore filename.js                   # Discard uncommitted changes
git revert <commit-hash>                 # Safe rollback commit
git stash && git stash pop               # Temporarily shelf changes`}
              </pre>
            </div>
          )}

          {activeCheatsheet === 'dsa' && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800' }}>⚡ Big-O Time & Space Complexity Reference</h3>
              <div className="table-responsive mt-3">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Algorithm / Structure</th>
                      <th>Access / Search</th>
                      <th>Insertion</th>
                      <th>Deletion</th>
                      <th>Space Complexity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Array</td><td>O(1) / O(N)</td><td>O(N)</td><td>O(N)</td><td>O(N)</td></tr>
                    <tr><td>Hash Table (Map)</td><td>O(1) avg</td><td>O(1) avg</td><td>O(1) avg</td><td>O(N)</td></tr>
                    <tr><td>Binary Search Tree</td><td>O(log N)</td><td>O(log N)</td><td>O(log N)</td><td>O(N)</td></tr>
                    <tr><td>Merge Sort</td><td>O(N log N)</td><td>-</td><td>-</td><td>O(N)</td></tr>
                    <tr><td>Quick Sort</td><td>O(N log N) avg</td><td>-</td><td>-</td><td>O(log N)</td></tr>
                    <tr><td>Dijkstra (Heap)</td><td>O((V + E) log V)</td><td>-</td><td>-</td><td>O(V)</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeCheatsheet === 'http' && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800' }}>🌐 HTTP Status Codes Reference</h3>
              <div className="row g-3 mt-2">
                {[
                  { code: '200 OK', desc: 'Standard successful HTTP response.' },
                  { code: '201 Created', desc: 'Resource was created successfully (e.g. POST /api/classes).' },
                  { code: '400 Bad Request', desc: 'Client sent invalid payload or missing fields.' },
                  { code: '401 Unauthorized', desc: 'Authentication is required and has failed or not been provided.' },
                  { code: '403 Forbidden', desc: 'Server understands request but refuses to authorize it.' },
                  { code: '404 Not Found', desc: 'The requested endpoint or resource does not exist.' },
                  { code: '500 Server Error', desc: 'Unexpected server exception or crash.' },
                  { code: '503 Service Unavailable', desc: 'API is temporarily unavailable or external key missing.' },
                ].map((s) => (
                  <div className="col-12 col-md-6" key={s.code}>
                    <div className="p-3 rounded-2 border bg-surface-elevated">
                      <strong className="text-primary">{s.code}</strong>
                      <p className="small text-muted m-0 mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
