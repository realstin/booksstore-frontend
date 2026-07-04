const API_URL = import.meta.env.VITE_API_URL;

export async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_URL}/api/books`);
    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}