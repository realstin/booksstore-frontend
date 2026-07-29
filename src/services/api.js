const API_URL = import.meta.env.VITE_API_URL;

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

// ========== SINGLE BOOK ==========

// Fetch one book by MongoDB _id
export async function getBookById(id) {
  const response = await fetch(`${API_URL}/api/books/${id}`, {
    credentials: 'include',
  });

  if (response.status === 404) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch book (status ${response.status})`);
  }

  return response.json();
}

// ========== DOWNLOAD ==========

/**
 * Streams the PDF through our backend proxy and returns a Blob.
 * This is required because the HTML `download` attribute is ignored
 * by browsers for cross-origin URLs (browser security policy).
 * The backend fetches the PDF and pipes it back as same-origin,
 * so the browser triggers a real file download.
 */
export async function downloadBook(id) {
  const response = await fetch(`${API_URL}/api/books/${id}/download`, {
    credentials: 'include',
  });

  if (response.status === 404) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }

  if (!response.ok) {
    throw new Error(`Download failed (status ${response.status})`);
  }

  return response.blob();
}

// Fetch statistics from backend
export async function getStats() {
  const response = await fetch(`${API_URL}/api/books/stats`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch statistics (status ${response.status})`);
  }

  return response.json();
}
// ========== AUTHENTICATION ==========

// Get current logged-in user
export async function getMe() {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user (status ${response.status})`);
  }

  return response.json();
}