import React, { useState } from 'react';

export default function CommunityChatView({
  posts = [],
  user,
  onLikePost,
  onReplyPost,
  onOpenCreatePost,
}) {
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [replyInput, setReplyInput] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});

  const channels = [
    'All',
    'General',
    'Sem 1',
    'Sem 2',
    'Sem 3',
    'Sem 4',
    'Sem 5',
    'Sem 6',
    'Sem 7',
    'Sem 8',
  ];

  const categories = [
    { id: 'All', label: 'All Topics' },
    { id: 'Announcement', label: '📢 Announcements' },
    { id: 'Doubt', label: '❓ Academic Doubts' },
    { id: 'Project', label: '🚀 Project Teams' },
    { id: 'ExamPrep', label: '📝 Exam & Viva Tips' },
  ];

  const filteredPosts = posts.filter((p) => {
    if (selectedChannel !== 'All' && p.semesterTag !== selectedChannel) return false;
    if (selectedCategory !== 'All' && p.categoryTag !== selectedCategory) return false;
    return true;
  });

  const toggleReplies = (postId) => {
    setExpandedReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSendReply = (postId) => {
    const text = replyInput[postId]?.trim();
    if (!text) return;

    onReplyPost(postId, {
      authorName: user?.name || (user?.role === 'faculty' ? 'Faculty' : 'Student'),
      authorRole: user?.role || 'student',
      text,
    });

    setReplyInput((prev) => ({ ...prev, [postId]: '' }));
    setExpandedReplies((prev) => ({ ...prev, [postId]: true }));
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header & New Post Button */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-chat-square-quote-fill text-primary me-2" /> Campus Community & Discussion Forum
          </h2>
          <p className="text-muted small">
            Connect with students and professors across all 8 semesters for doubts, team collaborations, and verified notices
          </p>
        </div>

        <button className="btn-primary-custom py-2 px-3" onClick={onOpenCreatePost}>
          <i className={`bi ${user?.role === 'faculty' ? 'bi-megaphone' : 'bi-plus-lg'} me-1`} />
          {user?.role === 'faculty' ? 'New Announcement' : 'Ask Doubt / Start Topic'}
        </button>
      </div>

      {/* Channel Filters */}
      <div className="day-tabs-container mb-0 pb-1">
        {channels.map((ch) => (
          <button
            key={ch}
            className={`day-tab-btn ${selectedChannel === ch ? 'active' : ''}`}
            onClick={() => setSelectedChannel(ch)}
          >
            {ch === 'All' ? '🌐 All Feeds' : ch === 'General' ? 'Campus General' : `${ch} Channel`}
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="d-flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      {filteredPosts.length === 0 ? (
        <div className="glass-card text-center py-5">
          <i className="bi bi-chat-dots text-muted" style={{ fontSize: '48px' }} />
          <h4 className="mt-3 font-weight-bold">No discussions in this channel</h4>
          <p className="text-muted small">Be the first to start a conversation or post a question!</p>
          <button className="btn-primary-custom mt-2" onClick={onOpenCreatePost}>
            <i className="bi bi-plus-lg" /> Post First Topic
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredPosts.map((post) => {
            const isFacultyPost = post.authorRole === 'faculty' || post.isAnnouncement;
            const hasLiked = post.likedBy?.includes(user?.id || user?.enrollmentNo || user?.facultyId);
            const isExpanded = expandedReplies[post._id];

            return (
              <div
                key={post._id}
                className="glass-card p-4"
                style={{
                  borderLeft: isFacultyPost ? '4px solid #f59e0b' : '4px solid var(--primary)',
                  background: isFacultyPost ? 'rgba(245, 158, 11, 0.04)' : undefined,
                }}
              >
                {/* Post Author Bar */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="avatar-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        fontSize: '13px',
                        background: isFacultyPost ? 'linear-gradient(135deg, #f59e0b, #d97706)' : undefined,
                      }}
                    >
                      {post.authorName?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <strong style={{ fontSize: '14px' }}>{post.authorName}</strong>
                        {isFacultyPost ? (
                          <span className="badge bg-warning text-dark font-weight-bold" style={{ fontSize: '10px' }}>
                            <i className="bi bi-patch-check-fill me-1" /> Faculty
                          </span>
                        ) : (
                          <span className="badge bg-secondary" style={{ fontSize: '10px' }}>Student</span>
                        )}
                      </div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        {post.authorDept || 'CSE'} · {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary-subtle text-primary border border-primary">
                      {post.semesterTag || 'General'}
                    </span>
                    <span className="badge bg-secondary">{post.categoryTag || 'Doubt'}</span>
                  </div>
                </div>

                {/* Post Title & Content */}
                <h3 style={{ fontSize: '16px', fontWeight: '800' }} className="mb-2">
                  {post.title}
                </h3>
                <div
                  className="small text-muted mb-3 font-monospace"
                  style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '13px' }}
                >
                  {post.content}
                </div>

                {/* Footer Reactions & Reply Trigger */}
                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className={`btn btn-sm ${hasLiked ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => onLikePost(post._id)}
                    >
                      <i className={`bi ${hasLiked ? 'bi-heart-fill text-danger' : 'bi-heart'} me-1`} />
                      <span>{post.likesCount || 0} Upvotes</span>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => toggleReplies(post._id)}
                    >
                      <i className="bi bi-chat-left-text me-1" />
                      <span>{post.replies?.length || 0} Answers</span>
                    </button>
                  </div>

                  <button
                    className="btn btn-sm text-primary"
                    onClick={() => toggleReplies(post._id)}
                  >
                    {isExpanded ? 'Hide Replies ▲' : 'Reply / View Answers ▼'}
                  </button>
                </div>

                {/* Threaded Replies Section */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-top bg-surface-elevated p-3 rounded-3">
                    <h5 style={{ fontSize: '13px', fontWeight: '800' }} className="mb-3 text-muted text-uppercase">
                      Discussion Thread ({post.replies?.length || 0})
                    </h5>

                    {/* Replies List */}
                    <div className="d-flex flex-column gap-2 mb-3">
                      {(post.replies || []).map((rep, idx) => (
                        <div key={idx} className="p-2 rounded-2 bg-surface border">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <div className="d-flex align-items-center gap-2">
                              <strong style={{ fontSize: '12px' }}>{rep.authorName}</strong>
                              {rep.authorRole === 'faculty' && (
                                <span className="badge bg-warning text-dark font-weight-bold" style={{ fontSize: '9px' }}>
                                  <i className="bi bi-patch-check-fill" /> Faculty
                                </span>
                              )}
                            </div>
                            <span className="small text-muted" style={{ fontSize: '10px' }}>
                              {new Date(rep.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="small m-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                            {rep.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input Bar */}
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Write your answer, solution or reply..."
                        value={replyInput[post._id] || ''}
                        onChange={(e) => setReplyInput({ ...replyInput, [post._id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply(post._id)}
                      />
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSendReply(post._id)}
                      >
                        <i className="bi bi-send-fill" /> Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
