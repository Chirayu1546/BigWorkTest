import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Lock, Save, ShieldCheck, Camera } from 'lucide-react';

const Profile = ({ lang = 'th' }) => {
  const { user, updateUser } = useContext(AuthContext);

  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '', profile_picture: '' });
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const fileInputRef = useRef(null);

  const t = {
    title:        lang === 'en' ? 'My Profile'          : 'โปรไฟล์ของฉัน',
    subtitle:     lang === 'en' ? 'Manage your account information' : 'จัดการข้อมูลบัญชีของคุณ',
    tabInfo:      lang === 'en' ? 'Personal Info'       : 'ข้อมูลส่วนตัว',
    tabPassword:  lang === 'en' ? 'Change Password'     : 'เปลี่ยนรหัสผ่าน',
    fullname:     lang === 'en' ? 'Full Name'           : 'ชื่อ-นามสกุล',
    email:        lang === 'en' ? 'Email'               : 'อีเมล',
    phone:        lang === 'en' ? 'Phone'               : 'เบอร์โทรศัพท์',
    currentPwd:   lang === 'en' ? 'Current Password'   : 'รหัสผ่านปัจจุบัน',
    newPwd:       lang === 'en' ? 'New Password'        : 'รหัสผ่านใหม่',
    confirmPwd:   lang === 'en' ? 'Confirm New Password' : 'ยืนยันรหัสผ่านใหม่',
    saveInfo:     lang === 'en' ? 'Save Changes'        : 'บันทึกการเปลี่ยนแปลง',
    savePwd:      lang === 'en' ? 'Update Password'     : 'อัปเดตรหัสผ่าน',
    role:         lang === 'en' ? 'Account Role'        : 'บทบาท',
    roleNote:     lang === 'en' ? 'Roles are assigned by an administrator.' : 'บทบาทกำหนดโดยผู้ดูแลระบบ',
    joined:       lang === 'en' ? 'Member since'        : 'สมาชิกตั้งแต่',
    emailNote:    lang === 'en' ? 'Email cannot be changed' : 'ไม่สามารถเปลี่ยนอีเมลได้',
  };

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const res = await axiosClient.get(`/users/profile/${user.user_id}`);
        setProfile({
          full_name: res.data.full_name || '',
          email:     res.data.email     || '',
          phone:     res.data.phone     || '',
          profile_picture: res.data.profile_picture || '',
          role:      res.data.role,
          created_at: res.data.created_at,
        });
      } catch {
        toast.error('Failed to load profile');
      }
    };
    fetch();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const res = await axiosClient.put(`/users/profile/${user.user_id}`, {
        full_name: profile.full_name,
        email:     profile.email,
        phone:     profile.phone,
      });
      // Update AuthContext so Sidebar/Topbar reflects new name/email
      updateUser({
        full_name: res.data.full_name,
        email: res.data.email,
        role: res.data.role,
        profile_picture: res.data.profile_picture,
      });
      toast.success(lang === 'en' ? 'Profile updated!' : 'อัปเดตโปรไฟล์สำเร็จ!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast.error(lang === 'en' ? 'Passwords do not match' : 'รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (passwords.new_password.length < 6) {
      toast.error(lang === 'en' ? 'Password must be at least 6 characters' : 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    setLoadingPassword(true);
    try {
      await axiosClient.put(`/users/profile/${user.user_id}`, {
        current_password: passwords.current_password,
        new_password:     passwords.new_password,
      });
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
      toast.success(lang === 'en' ? 'Password updated!' : 'เปลี่ยนรหัสผ่านสำเร็จ!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating password');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const res = await axiosClient.post(`/users/profile/${user.user_id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile((currentProfile) => ({ ...currentProfile, profile_picture: res.data.profile_picture }));
      updateUser({ profile_picture: res.data.profile_picture });
      toast.success(lang === 'en' ? 'Avatar updated!' : 'เปลี่ยนรูปโปรไฟล์สำเร็จ!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || '?';
  const avatarUrl = profile.profile_picture ? `http://localhost:5000/uploads/${profile.profile_picture}` : null;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>{t.subtitle}</p>
      </div>

      {/* Avatar + Info Card */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* Big Avatar */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '80px', height: '80px', borderRadius: '24px', flexShrink: 0,
            background: avatarUrl ? 'transparent' : 'var(--brand-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: '900', color: '#fff',
            boxShadow: '0 8px 24px var(--accent-glow)',
            cursor: 'pointer', position: 'relative', overflow: 'hidden'
          }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            avatarLetter
          )}
          {uploading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: '20px', height: '20px', border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          )}
          {!uploading && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '2px', display: 'flex', justifyContent: 'center' }}>
              <Camera size={14} color="#fff" />
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {profile.full_name || user?.username}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            {profile.email}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800',
              background: profile.role === 'admin' ? 'var(--pink-light)' : 'var(--accent-light)',
              color: profile.role === 'admin' ? 'var(--pink)' : 'var(--accent-text)',
              display: 'inline-flex', alignItems: 'center', gap: '5px',
            }}>
              <ShieldCheck size={12} />
              {profile.role?.toUpperCase()}
            </span>
            {profile.created_at && (
              <span style={{ fontSize: '12px', color: 'var(--text-faint)', paddingTop: '4px' }}>
                {t.joined} {new Date(profile.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--bg-input)', padding: '4px', borderRadius: '14px', width: 'fit-content' }}>
        {[
          { key: 'info',     label: t.tabInfo,     icon: <User size={15} /> },
          { key: 'password', label: t.tabPassword, icon: <Lock size={15} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '8px 18px', borderRadius: '10px', border: 'none',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              background: activeTab === tab.key ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === tab.key ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Personal Info ── */}
      {activeTab === 'info' && (
        <div className="glass-card" style={{ padding: '28px' }}>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Full Name */}
            <div>
              <label style={labelStyle}><User size={13} /> {t.fullname}</label>
              <input
                type="text" className="premium-input"
                placeholder={lang === 'en' ? 'Your full name' : 'ชื่อ-นามสกุลของคุณ'}
                value={profile.full_name}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>

            {/* Email (Editable now) */}
            <div>
              <label style={labelStyle}><Mail size={13} /> {t.email}</label>
              <input
                type="email" className="premium-input"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>

            {/* Role is visible to every user, but only the backend can assign it. */}
            <div>
              <label style={labelStyle}><ShieldCheck size={13} /> {t.role}</label>
              <select
                className="premium-input"
                value={profile.role || 'user'}
                disabled
                aria-label={t.role}
                style={{ cursor: 'not-allowed', opacity: 0.75 }}
              >
                <option value="user">USER</option>
                <option value="admin">ADMIN</option>
              </select>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '6px 0 0' }}>
                {t.roleNote}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}><Phone size={13} /> {t.phone}</label>
              <input
                type="tel" className="premium-input"
                placeholder={lang === 'en' ? '0812345678' : '0812345678'}
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            {/* Address */}
            <div style={{ display: 'none' }}></div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-premium" disabled={loadingProfile} style={{ padding: '11px 28px' }}>
                {loadingProfile
                  ? <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  : <><Save size={15} /> {t.saveInfo}</>
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tab: Change Password ── */}
      {activeTab === 'password' && (
        <div className="glass-card" style={{ padding: '28px' }}>
          <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={labelStyle}><Lock size={13} /> {t.currentPwd}</label>
              <input
                type="password" className="premium-input"
                placeholder="••••••••"
                value={passwords.current_password}
                onChange={e => setPasswords({ ...passwords, current_password: e.target.value })}
                required
              />
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }} />

            <div>
              <label style={labelStyle}><Lock size={13} /> {t.newPwd}</label>
              <input
                type="password" className="premium-input"
                placeholder="••••••••"
                value={passwords.new_password}
                onChange={e => setPasswords({ ...passwords, new_password: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={labelStyle}><Lock size={13} /> {t.confirmPwd}</label>
              <input
                type="password"
                className={`premium-input ${passwords.confirm_password && passwords.new_password !== passwords.confirm_password ? 'border-danger' : passwords.confirm_password && passwords.new_password === passwords.confirm_password ? 'border-success' : ''}`}
                placeholder="••••••••"
                value={passwords.confirm_password}
                onChange={e => setPasswords({ ...passwords, confirm_password: e.target.value })}
                required
              />
              {passwords.confirm_password && passwords.new_password !== passwords.confirm_password && (
                <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px', fontWeight: '600' }}>
                  {lang === 'en' ? 'Passwords do not match' : 'รหัสผ่านไม่ตรงกัน'}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-premium" disabled={loadingPassword} style={{ padding: '11px 28px' }}>
                {loadingPassword
                  ? <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  : <><Save size={15} /> {t.savePwd}</>
                }
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const labelStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
  marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px',
};

export default Profile;
