import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const translations = {
  en: {
    welcome: 'Welcome Back',
    desc: 'Sign in to your account to continue',
    username: 'Username',
    usernamePlaceholder: 'johndoe',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    btn: 'Sign In',
    noAccount: "Don't have an account?",
    create: 'Create Account',
    success: 'Login successful! Welcome back.',
    fail: 'Login failed. Please check your credentials.',
    forgot: 'Forgot Password?',
    remember: 'Remember me',
  },
  th: {
    welcome: 'ยินดีต้อนรับ',
    desc: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ',
    username: 'ชื่อผู้ใช้',
    usernamePlaceholder: 'johndoe',
    password: 'รหัสผ่าน',
    passwordPlaceholder: '••••••••',
    btn: 'เข้าสู่ระบบ',
    noAccount: 'ยังไม่มีบัญชีใช่หรือไม่?',
    create: 'สมัครสมาชิกใหม่',
    success: 'เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ',
    fail: 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล',
    forgot: 'ลืมรหัสผ่าน?',
    remember: 'จดจำฉันไว้',
  },
};

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lang, setLang] = useState('th');

  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const t = translations[lang];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/login', formData);
      login(res.data.user, res.data.token, rememberMe);
      toast.success(t.success);
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || t.fail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">

        {/* Brand mark above card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '8px',
        }}>
          <div style={{
            width: '48px', height: '48px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            background: 'transparent'
          }}>
            <img src="/favicon.png" alt="BigWork Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '36px 40px 32px' }}>

          {/* Top bar: Lang + Theme */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            {/* Lang pill */}
            <div className="lang-pill-wrap">
              {['th', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`lang-pill-btn ${lang === l ? 'active' : 'inactive'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="theme-toggle-btn"
            >
              {isDark
                ? <Sun size={16} style={{ color: '#fdd663' }} />
                : <Moon size={16} style={{ color: '#1565c0' }} />
              }
            </button>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
              marginBottom: '6px',
            }}>
              {t.welcome}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
              {t.desc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Username */}
            <div>
              <label style={labelStyle}>{t.username}</label>
              <input
                type="text"
                className="premium-input"
                name="username"
                placeholder={t.usernamePlaceholder}
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ ...labelStyle, margin: 0 }}>{t.password}</label>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); toast.info('ระบบลืมรหัสผ่านกำลังพัฒนา'); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '700', color: 'var(--accent-text)',
                    fontFamily: 'inherit', padding: 0,
                  }}
                >
                  {t.forgot}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="premium-input"
                  name="password"
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingRight: '44px' }}
                  required
                  minLength="8"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  style={eyeBtnStyle}
                >
                  {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '15px', height: '15px', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', cursor: 'pointer' }}>
                {t.remember}
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-premium" disabled={loading} style={{ marginTop: '4px' }}>
              {loading && <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: '8px', verticalAlign: 'middle' }} />}
              {t.btn}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontWeight: '500',
          }}>
            {t.noAccount}{' '}
            <Link
              to="/register"
              style={{ color: 'var(--accent-text)', fontWeight: '800', textDecoration: 'none' }}
            >
              {t.create}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const eyeBtnStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-faint)',
  display: 'flex',
  alignItems: 'center',
  padding: 0,
};

export default Login;
