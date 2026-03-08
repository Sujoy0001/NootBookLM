import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="glass-header">
      <div className="container flex-between" style={{ height: '70px' }}>
        <Link to="/" className="flex-center" style={{ gap: '10px', textDecoration: 'none' }}>
          <div className="btn-icon">
            <BookOpen size={20} color="#818cf8" />
          </div>
          <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(135deg, #c7d2fe, #818cf8, #e879f9)' }}>NootBookLM</h2>
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={toggleTheme} className="btn-icon" style={{ padding: '8px' }} aria-label="Toggle Theme">
            {isDark ? <Sun size={20} color="var(--text-main)" /> : <Moon size={20} color="var(--text-main)" />}
          </button>
          {currentUser ? (
            <>
              <Link to="/main" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Workspace</Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', gap: '8px' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Login</Link>
              )}
              {location.pathname !== '/register' && (
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Get Started</Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
