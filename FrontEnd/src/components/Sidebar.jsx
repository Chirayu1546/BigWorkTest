import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut, ChevronLeft, ChevronRight, Package, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const BigWorkLogo = () => (
  <img src="/favicon.png" alt="BigWork Logo" width="28" height="28" style={{ objectFit: 'contain' }} />
);

const translations = {
  en: {
    appName: 'OnlineStore',
    products: 'Products',
    manageProducts: 'Manage Products',
    employees: 'Employees',
    logout: 'Logout',
  },
  th: {
    appName: 'ร้านค้าออนไลน์',
    products: 'สินค้า',
    manageProducts: 'จัดการสินค้า',
    employees: 'จัดการผู้ใช้',
    logout: 'ออกจากระบบ',
  }
};

const Sidebar = ({ lang, collapsed, setCollapsed }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[lang];

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/products', icon: <ShoppingBag size={18} />, label: t.products },
    ...(user?.role === 'admin'
      ? [
          { path: '/manage-products', icon: <Package size={18} />, label: t.manageProducts },
          { path: '/employees', icon: <Users size={18} />, label: t.employees },
        ]
      : []),
  ];

  return (
    <div
      style={{
        width: collapsed ? '68px' : '224px',
        minHeight: '100vh',
        background: 'var(--sidebar-gradient)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1), background 0.3s ease',
        position: 'fixed',
        top: 0, left: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo + Collapse Button */}
      <div
        style={{
          height: '64px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '0 14px',
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <BigWorkLogo />
            <span style={{
              fontSize: '14px',
              fontWeight: '800',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.3px',
            }}>
              {t.appName}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            borderRadius: '8px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.color = 'var(--accent-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : ''}
            className={`sidebar-nav-link ${isActive(item.path) ? 'active' : 'inactive'}`}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Info + Logout at Bottom */}
      {user && (
        <div style={{ borderTop: '1px solid var(--border-light)', padding: '10px 8px' }}>
          {/* User Info */}
          {!collapsed ? (
            <div 
              onClick={() => navigate('/profile')}
              title={t.profile || 'Profile'}
              style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              marginBottom: '4px',
              borderRadius: '10px',
              background: 'var(--bg-hover)',
              cursor: 'pointer',
            }}>
              <div
                style={{
                  width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                  background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '800', overflow: 'hidden'
                }}
              >
                {user.profile_picture ? (
                  <img src={`http://localhost:5000/uploads/${user.profile_picture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.username?.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.username}
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--accent-text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {user.role}
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => navigate('/profile')}
              title={t.profile || 'Profile'}
              style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '4px',
              cursor: 'pointer',
            }}>
              <div
                style={{
                  width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                  background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '800', overflow: 'hidden'
                }}
                title={user.username}
              >
                {user.profile_picture ? (
                  <img src={`http://localhost:5000/uploads/${user.profile_picture}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.username?.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? t.logout : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '9px 12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-faint)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'inherit',
              justifyContent: collapsed ? 'center' : 'flex-start',
              whiteSpace: 'nowrap',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--danger-light)';
              e.currentTarget.style.color = 'var(--danger-text)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-faint)';
            }}
          >
            <span style={{ flexShrink: 0 }}><LogOut size={17} /></span>
            {!collapsed && <span>{t.logout}</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;