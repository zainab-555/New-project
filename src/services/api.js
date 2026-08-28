// API Service for Smart College Survival Assistant

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

/**
 * Fetch all classes from backend
 */
export async function fetchClasses() {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch classes (HTTP ${res.status})`);
  }
  return await res.json();
}

/**
 * Add a new class to backend
 * classData: { title, code, time, room, day }
 */
export async function createClass(classData) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(classData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to create class (HTTP ${res.status})`);
  }
  return await res.json();
}

/**
 * Delete a class by ID
 */
export async function deleteClass(id) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 204) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to delete class (HTTP ${res.status})`);
  }
  return true;
}

/**
 * Ask the AI Study Assistant
 */
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
