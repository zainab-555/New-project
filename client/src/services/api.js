// API Service for CampusHub Frontend

export const getApiBaseUrl = () => {
  return localStorage.getItem('campus_api_url') || import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

export const setApiBaseUrl = (url) => {
  if (!url) {
    localStorage.removeItem('campus_api_url');
  } else {
    localStorage.setItem('campus_api_url', url.replace(/\/+$/, ''));
  }
};

/**
 * Check backend health & database status
 */
export async function checkBackendHealth() {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${baseUrl}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    return { online: true, database: Boolean(data.database), data };
  } catch (error) {
    return { online: false, database: false, error: error.message };
  }
}

// -------------------------------------------------------------
// Classes Endpoints
// -------------------------------------------------------------
export async function fetchClasses() {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function createClass(classData) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(classData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function deleteClass(id) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
  return true;
}

// -------------------------------------------------------------
// Academic Vault (Resources: Notes, Assignments, PYQs)
// -------------------------------------------------------------
export async function fetchVaultResources(semester, type, subject) {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();
  if (semester) params.append('semester', semester);
  if (type && type !== 'All') params.append('type', type);
  if (subject && subject !== 'All') params.append('subject', subject);

  const res = await fetch(`${baseUrl}/api/resources?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function createVaultResource(resourceData) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resourceData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function deleteVaultResource(id) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/resources/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
  return true;
}

// -------------------------------------------------------------
// Campus Community Forum Endpoints
// -------------------------------------------------------------
export async function fetchCommunityPosts(semester, category) {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();
  if (semester && semester !== 'All') params.append('semester', semester);
  if (category && category !== 'All') params.append('category', category);

  const res = await fetch(`${baseUrl}/api/community/posts?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function createCommunityPost(postData) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/community/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function likeCommunityPost(postId, userId) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/community/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function replyCommunityPost(postId, replyData) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/community/posts/${postId}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(replyData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// -------------------------------------------------------------
// Leave Management Endpoints
// -------------------------------------------------------------
export async function fetchLeaves() {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaves`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function submitLeaveRequest(leaveData) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leaveData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function updateLeaveStatus(id, statusData) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaves/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statusData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// -------------------------------------------------------------
// Faculty Attendance Endpoints
// -------------------------------------------------------------
export async function fetchFacultyAttendance(semester, subjectCode) {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();
  if (semester) params.append('semester', semester);
  if (subjectCode) params.append('subjectCode', subjectCode);

  const res = await fetch(`${baseUrl}/api/faculty/attendance?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function saveFacultyAttendance(attendanceData) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/faculty/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attendanceData),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// -------------------------------------------------------------
// AI Study Assistant Endpoint
// -------------------------------------------------------------
export async function askAssistant(message) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'The assistant could not process your request.');
  }
  return data.answer;
}
