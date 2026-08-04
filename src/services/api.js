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
      credentials: 'include',
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
  // ============ NEW: ADD TIMEOUT ============
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    const response = await fetch(`${API_URL}/api/auth/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
      signal: controller.signal, // Attach abort signal
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
  } catch (error) {
    // ============ NEW: HANDLE ABORT/TIMEOUT ============
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    throw error;
    // ============ END TIMEOUT HANDLING ============
  } finally {
    clearTimeout(timeoutId);
  }
}

// ========== REGISTER ==========

export function registerUser({ name, email, password }) {
  return authRequest('register', {
    name,
    email,
    password,
  });
}

// ========== LOGIN ==========

export function loginUser({ email, password }) {
  return authRequest('login', {
    email,
    password,
  });
}

// ========== LOGOUT ==========

export async function logoutUser() {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  clearSession();

  return data;
}

// ========== BOOKS ==========

// params can include:
// featured (boolean)
// limit (number)
// sort (string, e.g. "-rating")
export async function getBooks(params = {}) {
  const query = new URLSearchParams();

  if (params.featured !== undefined) {
    query.set('featured', params.featured);
  }

  if (params.limit !== undefined) {
    query.set('limit', params.limit);
  }

  if (params.sort !== undefined) {
    query.set('sort', params.sort);
  }

  const queryString = query.toString();

  const url = `${API_URL}/api/books${
    queryString ? `?${queryString}` : ''
  }`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch books (status ${response.status})`
    );
  }

  return response.json();
}

// ========== SINGLE BOOK ==========

// Fetch one book by MongoDB _id
export async function getBookById(id) {
  const response = await fetch(
    `${API_URL}/api/books/${id}`,
    {
      credentials: 'include',
    }
  );

  if (response.status === 404) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch book (status ${response.status})`
    );
  }

  return response.json();
}

// ========== DOWNLOAD ==========

/**
 * Streams the PDF through our backend proxy and returns a Blob.
 * The backend fetches the PDF and pipes it back as same-origin,
 * allowing the browser to trigger a real file download.
 */
export async function downloadBook(id) {
  const response = await fetch(
    `${API_URL}/api/books/${id}/download`,
    {
      credentials: 'include',
    }
  );

  if (response.status === 404) {
    const err = new Error('Book not found');
    err.status = 404;
    throw err;
  }

  if (!response.ok) {
    throw new Error(
      `Download failed (status ${response.status})`
    );
  }

  return response.blob();
}

// ========== BOOK STATISTICS ==========

export async function getStats() {
  const response = await fetch(
    `${API_URL}/api/stats`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch statistics (status ${response.status})`
    );
  }

  return response.json();
}

// ========== EMAIL VERIFICATION ==========

/**
 * Verify an email address using the token from the verification link.
 * GET /api/auth/verify-email?token=<token>
 *
 * The backend returns a JSON object with at minimum a `code` field:
 *   EMAIL_VERIFIED
 *   EMAIL_ALREADY_VERIFIED
 *   INVALID_VERIFICATION_TOKEN
 *   VERIFICATION_TOKEN_EXPIRED
 */
export async function verifyEmail(token) {
  const response = await fetch(
    `${API_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
    { credentials: 'include' }
  );

  const data = await response.json().catch(() => ({}));

  // Always return the parsed data — the page decides what to show
  // based on response.ok + data.code
  return { ok: response.ok, status: response.status, ...data };
}

// ========== GOOGLE AUTH ==========

// Send Google ID token to backend for verification and session creation
export async function googleLogin(credential) {
  const response = await fetch(`${API_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ credential }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.errors ? data.errors.join(' ') : data.message;
    throw new Error(detail || 'Google authentication failed. Please try again.');
  }

  return data;
}

// ========== CURRENT USER ==========

// Get current logged-in user
export async function getMe() {
  const response = await fetch(
    `${API_URL}/api/auth/me`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch user (status ${response.status})`
    );
  }

  return response.json();
}

// ============================================================
// ========== LIBRARY ==========================================
// ============================================================

// Save a book to the authenticated user's library
export async function saveBook(bookId) {
  const response = await fetch(
    `${API_URL}/api/users/library/save/${bookId}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      `Failed to save book (status ${response.status})`
    );
  }

  return data;
}

// Remove a book from the authenticated user's library
export async function removeBook(bookId) {
  const response = await fetch(
    `${API_URL}/api/users/library/remove/${bookId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      `Failed to remove book (status ${response.status})`
    );
  }

  return data;
}

// Get all books saved by the authenticated user
export async function getLibrary() {
  const response = await fetch(
    `${API_URL}/api/users/library`,
    {
      credentials: 'include',
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      `Failed to fetch library (status ${response.status})`
    );
  }

  return data;
}