import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const translations = {
  en: {
    title: 'Create Account',
    desc: 'Join our OnlineStore today!',
    username: 'Username',
    usernamePlaceholder: 'johndoe',
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    passwordHint: 'Must be at least 8 characters',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: '••••••••',
    fullname: 'Full Name',
    fullnamePlaceholder: 'John Doe',
    btn: 'Create Account',
    hasAccount: 'Already have an account?',
    login: 'Sign In',
    success: 'Registration successful! Please sign in.',
    fail: 'Registration failed',
    passwordMismatch: 'Passwords do not match!',
    passwordLength: 'Password must be at least 8 characters.',
    usernameInvalid: 'Username must be English letters, numbers, underscore only (no spaces)',
    passwordInvalid: 'Password must be English letters/numbers/symbols only',
    required: '*',
  },
  th: {
    title: 'สมัครสมาชิก',
    desc: 'สร้างบัญชีใหม่สำหรับร้านค้าออนไลน์',
    username: 'ชื่อผู้ใช้',
    usernamePlaceholder: 'johndoe',
    email: 'อีเมล',
    emailPlaceholder: 'name@example.com',
    password: 'รหัสผ่าน',
    passwordPlaceholder: '••••••••',
    passwordHint: 'ต้องมีอย่างน้อย 8 ตัวอักษร',
    confirmPassword: 'ยืนยันรหัสผ่าน',
    confirmPasswordPlaceholder: '••••••••',
    fullname: 'ชื่อ-นามสกุล',
    fullnamePlaceholder: 'สมชาย ใจดี',
    btn: 'สมัครสมาชิก',
    hasAccount: 'มีบัญชีอยู่แล้วใช่หรือไม่?',
    login: 'เข้าสู่ระบบ',
    success: 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ',
    fail: 'สมัครสมาชิกไม่สำเร็จ',
    passwordMismatch: 'รหัสผ่านไม่ตรงกัน!',
    passwordLength: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',
    usernameInvalid: 'ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษ ตัวเลข หรือ _ เท่านั้น (ห้ามเว้นวรรค)',
    passwordInvalid: 'รหัสผ่านต้องเป็นภาษาอังกฤษ ตัวเลข หรือสัญลักษณ์เท่านั้น',
    required: '*',
  },
};

// Regex สำหรับตรวจสอบว่าเป็นภาษาอังกฤษเท่านั้น
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lang, setLang] = useState('th');

  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const t = translations[lang];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameRegex.test(formData.username)) {
      toast.error(t.usernameInvalid);
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      toast.error(t.passwordInvalid);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }
    if (formData.password.length < 8) {
      toast.error(t.passwordLength);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      await axiosClient.post('/auth/register', payload);
      toast.success(t.success);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || t.fail);
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordMismatch =
    formData.confirmPassword && formData.password !== formData.confirmPassword;
  const passwordValid = formData.password.length >= 8;

  return (
    <div className="auth-wrapper">
      <div className="auth-container register">

        {/* Brand mark above card */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
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
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '900',
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
              marginBottom: '5px',
            }}>
              {t.title}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
              {t.desc}
            </p>
          </div>

          {/* Form — 2 columns on wide screens */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

              {/* Username */}
              <div>
                <label style={labelStyle}>
                  {t.username} <span style={{ color: 'var(--pink)' }}>{t.required}</span>
                </label>
                <input
                  type="text"
                  className="premium-input"
                  name="username"
                  placeholder={t.usernamePlaceholder}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength="3"
                  maxLength="50"
                  autoComplete="username"
                  pattern="^[a-zA-Z0-9_]+$"
                  title={t.usernameInvalid}
                />
              </div>

              {/* Full Name */}
              <div>
                <label style={labelStyle}>
                  {t.fullname} <span style={{ color: 'var(--pink)' }}>{t.required}</span>
                </label>
                <input
                  type="text"
                  className="premium-input"
                  name="full_name"
                  placeholder={t.fullnamePlaceholder}
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              {/* Email — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>
                  {t.email} <span style={{ color: 'var(--pink)' }}>{t.required}</span>
                </label>
                <input
                  type="email"
                  className="premium-input"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>
                  {t.password} <span style={{ color: 'var(--pink)' }}>{t.required}</span>
                </label>
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
                    autoComplete="new-password"
                    pattern="^[a-zA-Z0-9!@#$%^&amp;*()_+\-=\[\]{};':&quot;\\|,.&lt;&gt;\/?]+$"
                    title={t.passwordInvalid}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex="-1" style={eyeBtnStyle}>
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {/* แสดง hint เฉพาะเมื่อผู้ใช้เริ่มพิมพ์แล้วเท่านั้น */}
                {formData.password.length > 0 && (
                  <p style={{
                    fontSize: '11px',
                    marginTop: '4px',
                    fontWeight: '600',
                    color: passwordValid ? 'var(--success, #22c55e)' : 'var(--danger)',
                  }}>
                    {t.passwordHint}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>
                  {t.confirmPassword} <span style={{ color: 'var(--pink)' }}>{t.required}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`premium-input ${passwordMismatch ? 'border-danger' : passwordMatch ? 'border-success' : ''}`}
                    name="confirmPassword"
                    placeholder={t.confirmPasswordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ paddingRight: '44px' }}
                    required
                    minLength="8"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex="-1" style={eyeBtnStyle}>
                    {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {passwordMismatch && (
                  <p style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px', fontWeight: '600' }}>
                    {t.passwordMismatch}
                  </p>
                )}
              </div>

            </div>

            {/* Submit */}
            <button type="submit" className="btn-premium" disabled={loading} style={{ marginTop: '20px' }}>
              {loading && (
                <span style={{
                  display: 'inline-block', width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
                  borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                  marginRight: '8px', verticalAlign: 'middle',
                }} />
              )}
              {t.btn}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: '22px',
            paddingTop: '18px',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontWeight: '500',
          }}>
            {t.hasAccount}{' '}
            <Link to="/login" style={{ color: 'var(--accent-text)', fontWeight: '800', textDecoration: 'none' }}>
              {t.login}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
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

export default Register;