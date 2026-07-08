import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from "../services/api";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call the logout function from api.js
        // This will:
        // 1. Send POST to /api/auth/logout
        // 2. Backend clears HTTP-only cookie
        // 3. Frontend clears localStorage
        await logoutUser();
        
        // After successful logout, redirect to login page
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Even if logout fails, clear local data and redirect
        navigate('/login');
      }
    };

    // Call logout as soon as this page loads
    handleLogout();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Logging you out...</h2>
      <p>Please wait while we clear your session.</p>
    </div>
  );
}

export default Logout;