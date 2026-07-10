import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';
import { useAuth } from '../hooks/useAuth';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call backend logout
        await logoutUser();
        
        // Clear context
        logout();
        
        // Redirect to login
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // Even if logout fails, clear local state
        logout();
        navigate('/login');
      }
    };

    handleLogout();
  }, [navigate, logout]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Logging you out...</h2>
      <p>Please wait while we clear your session.</p>
    </div>
  );
}

export default Logout;