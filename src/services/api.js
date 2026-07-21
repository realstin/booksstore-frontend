const API_URL = import.meta.env.VITE_API_URL;

// ========== SESSION HELPERS ==========
export function getUser() {
  const raw = localStorage.getItem('bookstowa_user');
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem('bookstowa_user');
}

// ========== BACKEND STATUS CHECK ==========
export async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_URL}/api/books`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    return { connected: true };

  } catch (error) {
    return { connected: false, error: error.message };
  }
}

// ========== AUTH ==========
async function authRequest(path, body) {

  const response = await fetch(`${API_URL}/api/auth/${path}`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    credentials: "include",

    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {

    const detail = data.errors
      ? data.errors.join(' ')
      : data.message;

    throw new Error(
      detail || 'Something went wrong. Please try again.'
    );
  }

  return data;
}

// ========== REGISTER ==========
export function registerUser({ name, email, password }) {
  return authRequest(
    'register',
    {
      name,
      email,
      password
    }
  );
}

// ========== LOGIN ==========
export function loginUser({ email, password }) {
  return authRequest(
    'login',
    {
      email,
      password
    }
  );
}

// ========== LOGOUT ==========
export async function logoutUser() {

  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  clearSession();
  return data;
}

// ========== BOOKS ==========

// params can include: featured (boolean), limit (number), sort (string, e.g. "-rating")
export async function getBooks(params = {}) {
  const query = new URLSearchParams();

  if (params.featured !== undefined) query.set('featured', params.featured);
  if (params.limit !== undefined) query.set('limit', params.limit);
  if (params.sort !== undefined) query.set('sort', params.sort);

  const queryString = query.toString();
  const url = `${API_URL}/api/books${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Failed to fetch books (status ${response.status})`);
  }

  return response.json();
}