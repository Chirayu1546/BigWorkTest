import { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Topbar = ({ lang, setLang }) => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        height: '64px',
        background: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 24px',
        gap: '12px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'background 0.3s ease',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 0 var(--border)',
      }}
    >
      {/* Rainbow bottom strip */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '2px',
        background: 'var(--rainbow-gradient)',
        opacity: 0.6,
      }} />

      {/* Language Pill Toggle */}
      <div className="lang-pill-wrap">
        {['th', 'en'].map((l) => (
          <button
            key={l}
            id={`lang-btn-${l}`}
            onClick={() => setLang(l)}
            className={`lang-pill-btn ${lang === l ? 'active' : 'inactive'}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Dark / Light Mode Toggle */}
      <button
        id="theme-toggle-btn"
        onClick={toggleTheme}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="theme-toggle-btn"
      >
        {isDark
          ? <Sun size={16} style={{ color: '#f59e0b' }} />
          : <Moon size={16} style={{ color: '#7c3aed' }} />
        }
      </button>

      {/* User Chip — click to go to profile */}
      {user && (
        <div
          className="user-chip"
          onClick={() => navigate('/profile')}
          title={lang === 'en' ? 'View Profile' : 'ดูโปรไฟล์'}
          style={{ cursor: 'pointer' }}
        >
          <div className="user-chip-avatar" style={{ overflow: 'hidden' }}>
            {user.profile_picture ? (
              <img src={`http://localhost:5000/uploads/${user.profile_picture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user.username?.charAt(0).toUpperCase()
            )}
          </div>
          <span className="user-chip-name">{user.username}</span>
        </div>
      )}
    </div>
  );
};

export default Topbar;
