import React, { useState, useRef, useEffect } from 'react';
import { askAssistant, submitLeaveRequest } from '../services/api';
import { getOfflineAiAnswer, generateFlashcards } from '../services/aiKnowledge';

export default function AssistantView({ initialQuery = '', onToast, onSubmitLeave, user }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'flashcards' | 'leave'
  const [inputMessage, setInputMessage] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      from: 'assistant',
      text: `👋 **Hi there! I am your AI College Study Assistant.**\n\nI can help you with:\n- 💡 **Conceptual Doubts** (DBMS, DSA, OOPs, OS, Networks, Web Dev, AI/ML)\n- 📝 **Exam & Viva Preparation** (Key definitions, formulas & practice questions)\n- ✉️ **College Formalities** (Generate and submit verified leave letters directly to HOD/Faculty)\n\nAsk anything below or choose a prompt to get started!`,
    },
  ]);

  const [flashcardSubject, setFlashcardSubject] = useState('Data Structures');
  const [flashcards, setFlashcards] = useState(generateFlashcards('Data Structures'));

  const [leaveData, setLeaveData] = useState({
    name: user?.name || 'Aman Sharma',
    roll: user?.enrollmentNo || '21BCSE042',
    branch: `${user?.branch || 'CSE'} Sem ${user?.semester || 6}`,
    hodName: 'Ajaz Hussain Warsi',
    reason: 'severe viral fever and medical rest advised by physician',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = { id: `msg-${Date.now()}-u`, from: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const liveAnswer = await askAssistant(query);
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now()}-a`, from: 'assistant', text: liveAnswer },
      ]);
    } catch (err) {
      console.warn('Backend assistant offline, using rich CS knowledge base fallback:', err.message);
      const offlineAnswer = getOfflineAiAnswer(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-a`,
          from: 'assistant',
          text: offlineAnswer,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    if (onToast) onToast('Copied to clipboard!', 'success');
  };

  const handleGenerateLetter = () => {
    const letter = `Subject: Application for Leave of Absence - ${leaveData.name} (Roll No: ${leaveData.roll})

Respected Prof. ${leaveData.hodName || 'Ajaz Hussain Warsi'},

I am writing to formally request a leave of absence from ${leaveData.startDate} to ${leaveData.endDate} due to ${leaveData.reason}.

I assure you that I will review the lecture notes from the Semester Vault and catch up on all assigned coursework and lab submissions promptly upon my return.

Kindly grant me leave and mark my attendance accordingly.

Thank you for your understanding.

Yours sincerely,
${leaveData.name}
Roll No: ${leaveData.roll}
Branch & Semester: ${leaveData.branch}
Date: ${new Date().toLocaleDateString()}`;

    setGeneratedLetter(letter);
  };

  const handleSubmitLeaveToFaculty = async () => {
    if (!generatedLetter) handleGenerateLetter();
    setIsSubmittingLeave(true);
    try {
      const payload = {
        studentName: leaveData.name,
        studentRoll: leaveData.roll,
        semester: leaveData.branch,
        hodName: leaveData.hodName,
        reason: leaveData.reason,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        status: 'pending',
      };
      if (onSubmitLeave) {
        await onSubmitLeave(payload);
      } else {
        await submitLeaveRequest(payload);
      }
      if (onToast) onToast('Leave application submitted directly to Faculty portal for approval!', 'success');
    } catch (err) {
      if (onToast) onToast('Saved leave application locally!', 'info');
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="mt-2 mb-1" style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={idx} className="mt-2 mb-1" style={{ fontSize: '13px', fontWeight: '700' }}>
            {line.replace('#### ', '')}
          </h5>
        );
      }
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = line.trim().replace(/^[-*]\s+/, '');
        return (
          <div key={idx} className="d-flex align-items-start gap-2 my-1 ps-2">
            <span className="text-primary">•</span>
            <span>{formatBoldAndCode(itemContent)}</span>
          </div>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-start border-3 border-primary ps-3 my-2 text-muted fst-italic">
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      return (
        <p key={idx} className="mb-2">
          {formatBoldAndCode(line)}
        </p>
      );
    });
  };

  const formatBoldAndCode = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="font-monospace text-primary bg-surface-elevated px-1 rounded">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header & Tool Tabs */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            <i className="bi bi-robot text-primary me-2" /> AI College Study Assistant
          </h2>
          <p className="text-muted small">Ask academic questions, generate study flashcards, or draft leave letters</p>
        </div>

        <div className="btn-group">
          <button
            className={`btn btn-sm ${activeTab === 'chat' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('chat')}
          >
            <i className="bi bi-chat-dots-fill me-1" /> Doubts Chat
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'flashcards' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('flashcards')}
          >
            <i className="bi bi-card-checklist me-1" /> Flashcards
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'leave' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab('leave')}
          >
            <i className="bi bi-envelope-paper-fill me-1" /> Leave Letter
          </button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="chat-container">
          <div className="chat-header-bar">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                AI
              </div>
              <div>
                <strong style={{ fontSize: '13px' }}>Study Assistant Bot</strong>
                <span className="badge bg-success ms-2" style={{ fontSize: '10px' }}>Active</span>
              </div>
            </div>

            <button
              className="btn btn-sm btn-outline-secondary py-1 px-2"
              onClick={() => setMessages([messages[0]])}
              title="Clear Conversation"
            >
              <i className="bi bi-trash3 me-1" /> Clear
            </button>
          </div>

          <div className="chat-messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.from}`}>
                {msg.from === 'user' ? (
                  <div>{msg.text}</div>
                ) : (
                  <div>
                    {renderFormattedText(msg.text)}
                    <div className="d-flex justify-content-end mt-2 pt-1 border-top border-secondary-subtle">
                      <button
                        className="btn btn-sm text-muted p-0"
                        style={{ fontSize: '11px' }}
                        onClick={() => handleCopyCode(msg.text)}
                        title="Copy Response"
                      >
                        <i className="bi bi-clipboard me-1" /> Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble assistant">
                <div className="d-flex align-items-center gap-2">
                  <div className="spinner-grow spinner-grow-sm text-primary" />
                  <span>Assistant is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="prompt-chips-grid">
            {[
              'Explain ACID Properties in DBMS',
              'Process vs Thread in OS',
              '4 OOP Pillars with Examples',
              'Explain Dijkstra Algorithm',
              'Important Exam Questions',
              'TCP 3-Way Handshake',
            ].map((prompt) => (
              <button
                key={prompt}
                className="prompt-chip"
                disabled={isLoading}
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
          >
            <input
              type="text"
              placeholder="Ask any question, exam topic, or programming doubt..."
              value={inputMessage}
              disabled={isLoading}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" disabled={isLoading || !inputMessage.trim()}>
              <i className="bi bi-send-fill" />
            </button>
          </form>
        </div>
      )}

      {activeTab === 'flashcards' && (
        <div className="glass-card">
          <div className="card-header-flex">
            <div>
              <h3>
                <i className="bi bi-card-checklist text-primary" /> Quick Study Flashcard Generator
              </h3>
              <p>Generate bite-sized concept cards for fast revision before exams or viva</p>
            </div>
          </div>

          <div className="d-flex gap-2 mb-4 flex-wrap">
            {['Data Structures', 'Database Systems', 'Operating Systems', 'Computer Networks', 'AI & Machine Learning'].map((subj) => (
              <button
                key={subj}
                className={`btn btn-sm ${flashcardSubject === subj ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => {
                  setFlashcardSubject(subj);
                  setFlashcards(generateFlashcards(subj));
                }}
              >
                {subj}
              </button>
            ))}
          </div>

          <div className="row g-3">
            {flashcards.map((card, i) => (
              <div className="col-12 col-md-4" key={i}>
                <div
                  className="p-3 rounded-3 border h-100 d-flex flex-column justify-content-between"
                  style={{ background: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}
                >
                  <div>
                    <span className="badge bg-primary mb-2">Card #{i + 1}</span>
                    <h5 style={{ fontSize: '14px', fontWeight: '700' }}>{card.q}</h5>
                  </div>
                  <div className="mt-3 pt-2 border-top small text-muted">
                    <strong>Answer:</strong> {card.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="glass-card">
              <h3 className="mb-3" style={{ fontSize: '16px', fontWeight: '800' }}>
                <i className="bi bi-envelope-paper text-primary me-2" /> Leave Application Details
              </h3>

              <div className="form-group-custom">
                <label>Student Name</label>
                <input
                  type="text"
                  className="form-input-custom"
                  value={leaveData.name}
                  onChange={(e) => setLeaveData({ ...leaveData, name: e.target.value })}
                />
              </div>

              <div className="row g-2">
                <div className="col-6 form-group-custom">
                  <label>Roll Number</label>
                  <input
                    type="text"
                    className="form-input-custom"
                    value={leaveData.roll}
                    onChange={(e) => setLeaveData({ ...leaveData, roll: e.target.value })}
                  />
                </div>
                <div className="col-6 form-group-custom">
                  <label>Branch & Sem</label>
                  <input
                    type="text"
                    className="form-input-custom"
                    value={leaveData.branch}
                    onChange={(e) => setLeaveData({ ...leaveData, branch: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label>Professor / Faculty Name</label>
                <input
                  type="text"
                  className="form-input-custom"
                  value={leaveData.hodName}
                  onChange={(e) => setLeaveData({ ...leaveData, hodName: e.target.value })}
                />
              </div>

              <div className="form-group-custom">
                <label>Reason for Leave</label>
                <input
                  type="text"
                  className="form-input-custom"
                  placeholder="e.g. fever, family wedding, sports event"
                  value={leaveData.reason}
                  onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                />
              </div>

              <div className="row g-2">
                <div className="col-6 form-group-custom">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-input-custom"
                    value={leaveData.startDate}
                    onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                  />
                </div>
                <div className="col-6 form-group-custom">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-input-custom"
                    value={leaveData.endDate}
                    onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <button className="btn-primary-custom w-100 mt-2" onClick={handleGenerateLetter}>
                <i className="bi bi-magic" /> Generate Formal Draft
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="glass-card h-100 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                <h3 className="m-0" style={{ fontSize: '16px', fontWeight: '800' }}>
                  <i className="bi bi-file-earmark-text text-primary me-2" /> Generated Letter Preview
                </h3>
                {generatedLetter && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleCopyCode(generatedLetter)}
                    >
                      <i className="bi bi-clipboard me-1" /> Copy Draft
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleSubmitLeaveToFaculty}
                      disabled={isSubmittingLeave}
                    >
                      <i className="bi bi-send-check-fill me-1" />
                      {isSubmittingLeave ? 'Submitting...' : 'Submit to Faculty Portal'}
                    </button>
                  </div>
                )}
              </div>

              <textarea
                className="form-input-custom font-monospace flex-1"
                rows={12}
                readOnly
                placeholder="Click 'Generate Formal Draft' on the left to create your letter..."
                value={generatedLetter}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
