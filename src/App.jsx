import { useMemo, useState } from 'react';

const classes = [
  { time: '09:00 AM', title: 'Data Structures', code: 'CSE-301', icon: 'bi-code-slash', tone: 'green' },
  { time: '10:15 AM', title: 'DBMS', code: 'CSE-302', icon: 'bi-calendar2-week', tone: 'orange' },
  { time: '01:00 PM', title: 'Web Development', code: 'CSE-303', icon: 'bi-globe2', tone: 'purple' },
];

const assignments = [
  { title: 'DBMS Mini Project', date: '25 May 2025', priority: 'High', tone: 'danger' },
  { title: 'DSA Problem Set', date: '28 May 2025', priority: 'Medium', tone: 'warning' },
  { title: 'Web Dev Assignment', date: '30 May 2025', priority: 'Low', tone: 'success' },
];

function Card({ children, className = '' }) {
  return <section className={`app-card ${className}`}>{children}</section>;
}

function Home() {
  return <>
    <header className="d-flex align-items-center justify-content-between mb-4">
      <div className="d-flex align-items-center gap-3"><button className="icon-button"><i className="bi bi-list" /></button><div><h1>Hi Student! <span>👋</span></h1><p>Good Morning!</p></div></div>
      <button className="icon-button notification"><i className="bi bi-bell" /><b>3</b></button>
    </header>
    <div className="row g-3 stats mb-3">
      <div className="col-6 col-md-3"><div className="stat lavender"><small>Attendance</small><strong>72%</strong><span>Good</span></div></div>
      <div className="col-6 col-md-3"><div className="stat peach"><small>CGPA</small><strong>8.45</strong><span>Current</span></div></div>
      <div className="col-6 col-md-3"><div className="stat blue"><small>Assignments</small><strong>4</strong><span>Pending</span></div></div>
      <div className="col-6 col-md-3"><div className="stat mint"><small>Today's Classes</small><strong>3</strong><span>Today</span></div></div>
    </div>
    <Card className="mb-3"><div className="section-heading"><div><h2>Today's Schedule</h2><p>Monday, 20 May</p></div><button className="text-button">View All</button></div>{classes.map((item) => <div className="class-row" key={item.code}><span className={`class-icon ${item.tone}`}><i className={`bi ${item.icon}`} /></span><div><h3>{item.title}</h3><p>{item.time} – {item.time === '01:00 PM' ? '03:00 PM' : item.time === '09:00 AM' ? '10:00 AM' : '11:15 AM'}</p></div><span className="course-code">{item.code}</span></div>)}</Card>
    <button className="assistant-banner"><span><b>AI Study Assistant</b><small>Ask doubts, get explanations, notes and more.</small></span><i className="bi bi-robot" /></button>
    <Card className="mt-3"><div className="section-heading"><h2>Upcoming Assignments</h2><button className="text-button">View All</button></div>{assignments.map((item) => <div className="assignment-row" key={item.title}><span className="assignment-icon"><i className="bi bi-file-earmark-text" /></span><div><h3>{item.title}</h3><p>Due: {item.date}</p></div><span className={`badge text-bg-${item.tone}-subtle text-${item.tone}-emphasis`}>{item.priority}</span></div>)}</Card>
  </>;
}

function Timetable() { return <><header className="page-header"><button className="icon-button"><i className="bi bi-arrow-left" /></button><h1>Timetable</h1><button className="icon-button"><i className="bi bi-three-dots-vertical" /></button></header><div className="week-tabs">{['Mon','Tue','Wed','Thu','Fri','Sat'].map((day, index) => <button className={index === 0 ? 'active' : ''} key={day}>{day}</button>)}</div><div className="mt-4">{[...classes, { time: '03:15 PM', title: 'Java Programming', code: 'CSE-305', icon: 'bi-cup-hot', tone: 'orange' }].map((item) => <Card className="timetable-row mb-3" key={item.title}><time>{item.time}<small>{item.time.includes('PM') ? 'PMM' : 'AMM'}</small></time><div><h3>{item.title}</h3><p>{item.code} · Room 201</p></div><span className={`class-icon ${item.tone}`}><i className={`bi ${item.icon}`} /></span></Card>)}</div><button className="primary-button mt-2"><i className="bi bi-plus-lg" /> Add Class</button></> }

function Assistant() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const answerFor = (question) => {
    const text = question.toLowerCase();
    if (text.includes('dbms')) return 'DBMS (Database Management System) is software used to store, organize and retrieve data. Examples: MySQL, MongoDB and Oracle. It reduces duplicate data and makes data management easier.';
    if (text.includes('oop')) return 'OOPs is a programming approach based on objects. Its four main concepts are Encapsulation, Inheritance, Polymorphism and Abstraction. It helps make programs reusable and easier to maintain.';
    if (text.includes('operating system') || text.includes('mind map') || text.includes(' os')) return 'Operating System mind map: OS → Process Management, Memory Management, File Management, Device Management, Security and User Interface. Examples are Windows, Linux and Android.';
    if (text.includes('important question')) return 'Try these exam questions: 1. Explain normalization in DBMS. 2. Differentiate process and thread. 3. Explain OOP pillars with examples. 4. What is a stack and queue? 5. Explain HTTP request methods.';
    return 'I can currently help with DBMS, OOPs, Operating Systems and common exam questions. For open-ended answers, we will connect the assistant to the OpenAI API through the Express backend.';
  };
  const ask = async (question) => {
    const cleanQuestion = question.trim(); if (!cleanQuestion || isLoading) return;
    setMessages((previous) => [...previous, { from: 'user', text: cleanQuestion }]); setMessage(''); setIsLoading(true);
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/assistant`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: cleanQuestion }) });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || 'Assistant could not respond.');
      setMessages((previous) => [...previous, { from: 'bot', text: data.answer }]);
    } catch (error) { setMessages((previous) => [...previous, { from: 'bot', text: `${error.message} For now, here is a quick answer: ${answerFor(cleanQuestion)}` }]); }
    finally { setIsLoading(false); }
  };
  const send = (event) => { event.preventDefault(); ask(message); };
  return <><header className="page-header"><button className="icon-button"><i className="bi bi-arrow-left" /></button><h1>AI Study Assistant</h1><button className="icon-button"><i className="bi bi-clock-history" /></button></header><Card className="ai-welcome"><div className="robot">🤖</div><div><h2>Hi Student! 👋</h2><p>How can I help you today?</p></div><div className="prompts">{['Explain DBMS','Short note on OOPs','Important questions','Mind map for OS'].map((prompt) => <button disabled={isLoading} key={prompt} onClick={() => ask(prompt)}>{prompt}</button>)}</div></Card><div className="chat-window">{messages.length === 0 ? <div className="empty-chat"><i className="bi bi-chat-square-text" /><p>Ask a question to start learning.</p></div> : messages.map((item, index) => <div className={`message ${item.from}`} key={index}>{item.text}</div>)}{isLoading && <div className="message bot">Thinking...</div>}</div><form className="chat-input" onSubmit={send}><input disabled={isLoading} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask anything..." /><button disabled={isLoading} aria-label="Send"><i className="bi bi-send-fill" /></button></form></>;
}

function Placeholder({ label, icon }) { return <><header className="page-header"><span /><h1>{label}</h1><span /></header><Card className="placeholder"><i className={`bi ${icon}`} /><h2>{label}</h2><p>This section will be connected to the backend next.</p></Card></> }

const tabs = [{ id:'home', label:'Home', icon:'bi-house-door-fill' }, { id:'timetable', label:'Timetable', icon:'bi-calendar3' }, { id:'assistant', label:'Assistant', icon:'bi-robot' }, { id:'notes', label:'Notes', icon:'bi-file-earmark-text' }, { id:'profile', label:'Profile', icon:'bi-person' }];
export default function App() { const [screen, setScreen] = useState('home'); const view = screen === 'home' ? <Home /> : screen === 'timetable' ? <Timetable /> : screen === 'assistant' ? <Assistant /> : <Placeholder label={screen === 'notes' ? 'Notes' : 'Profile'} icon={screen === 'notes' ? 'bi-journal-text' : 'bi-person-circle'} />; return <main className="app-shell"><div className="app-content">{view}</div><nav className="bottom-nav">{tabs.map((tab) => <button className={screen === tab.id ? 'active' : ''} onClick={() => setScreen(tab.id)} key={tab.id}><i className={`bi ${tab.icon}`} /><span>{tab.label}</span></button>)}</nav></main>; }
