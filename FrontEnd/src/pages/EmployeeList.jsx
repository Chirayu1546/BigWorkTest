import { useState, useEffect, useContext } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Edit, Trash2, X, UserCheck, Save } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const roleOrder = { admin: 0, employee: 1 };

const translations = {
    en: {
        title: 'All Users',
        searchPlaceholder: 'Search username / full name / email',
        username: 'Username',
        fullname: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        role: 'Role',
        actions: 'Actions',
        loading: 'Loading...',
        saving: 'Saving...',
        noData: 'No users found',
        loadFail: 'Failed to load users',
        editUser: 'Edit User',
        save: 'Save Changes',
        cancel: 'Cancel',
        deleteConfirm: 'Are you sure you want to delete this user?',
        updateSuccess: 'User updated successfully',
        deleteSuccess: 'User deleted successfully',
        cannotChangeOwnRole: 'You cannot change your own role here.',
    },
    th: {
        title: 'รายชื่อผู้ใช้ทั้งหมด',
        searchPlaceholder: 'ค้นหาชื่อผู้ใช้ / ชื่อ-นามสกุล / อีเมล',
        username: 'ชื่อผู้ใช้',
        fullname: 'ชื่อ-นามสกุล',
        email: 'อีเมล',
        phone: 'เบอร์โทร',
        role: 'บทบาท',
        actions: 'จัดการ',
        loading: 'กำลังโหลด...',
        saving: 'กำลังบันทึก...',
        noData: 'ไม่พบข้อมูล',
        loadFail: 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ',
        editUser: 'แก้ไขข้อมูลผู้ใช้',
        save: 'บันทึก',
        cancel: 'ยกเลิก',
        deleteConfirm: 'คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?',
        updateSuccess: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
        deleteSuccess: 'ลบผู้ใช้สำเร็จ',
        cannotChangeOwnRole: 'ไม่สามารถเปลี่ยนบทบาทของตัวเองจากหน้านี้ได้',
    },
};

const EmployeeList = ({ lang = 'th' }) => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // State สำหรับ Modal แก้ไข
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', role: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = translations[lang];

    const fetchUsers = async () => {
        try {
            const res = await axiosClient.get('/users');
            setUsers(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || t.loadFail);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSort = (key) => {
        if (!key) return;
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
    };

    // --- จัดการการแก้ไขข้อมูล ---
    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setFormData({
            full_name: user.full_name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'employee',
        });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axiosClient.put(`/users/${editingUser.user_id}`, formData);
            toast.success(t.updateSuccess);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- จัดการการลบผู้ใช้ ---
    const handleDelete = async (user) => {
        if (!window.confirm(t.deleteConfirm)) return;
        try {
            await axiosClient.delete(`/users/${user.user_id}`);
            toast.success(t.deleteSuccess);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const filteredUsers = users.filter((u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig.key) {
            return (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
        }

        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'role') {
            valA = roleOrder[a.role] ?? 99;
            valB = roleOrder[b.role] ?? 99;
        } else {
            valA = (valA || '').toString().toLowerCase();
            valB = (valB || '').toString().toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const columns = [
        { key: 'username', label: t.username },
        { key: 'full_name', label: t.fullname },
        { key: 'role', label: t.role },
        { key: null, label: t.actions },
    ];

    const isEditingSelf = editingUser?.user_id === currentUser?.user_id;

    if (loading) return <div style={{ padding: '24px', color: 'var(--text-primary)' }}>{t.loading}</div>;

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>
                {t.title}
            </h1>

            <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="premium-input"
                style={{ marginBottom: '16px', maxWidth: '360px' }}
            />

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key || idx}
                                    onClick={() => col.key && handleSort(col.key)}
                                    style={{ ...thStyle, cursor: col.key ? 'pointer' : 'default', userSelect: 'none' }}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        {col.label}
                                        {col.key && getSortIcon(col.key)}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((u) => (
                            <tr key={u.user_id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={tdStyle}>{u.username}</td>
                                <td style={tdStyle}>{u.full_name}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: '2px 10px',
                                        borderRadius: '999px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        background: u.role === 'admin' ? 'rgba(59,130,246,0.15)' : 'rgba(148,163,184,0.15)',
                                        color: u.role === 'admin' ? '#3b82f6' : 'var(--text-muted)',
                                    }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleOpenEdit(u)}
                                            style={actionBtnStyle}
                                            title="Edit"
                                        >
                                            <Edit size={16} color="#3b82f6" />
                                        </button>
                                        {/* ซ่อนปุ่มลบถ้าเป็นแถวของตัวเอง */}
                                        {u.user_id !== currentUser?.user_id && (
                                            <button
                                                onClick={() => handleDelete(u)}
                                                style={actionBtnStyle}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} color="#ef4444" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {sortedUsers.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        {t.noData}
                    </p>
                )}
            </div>

            {/* Modal แก้ไขข้อมูลผู้ใช้ - UI Match Theme */}
            {editingUser && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        {/* Top Gradient Bar */}
                        <div style={topBarStyle} />

                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={iconBadgeStyle}>
                                    <UserCheck size={20} color="#2563eb" />
                                </div>
                                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                                    {t.editUser} <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>(@{editingUser.username})</span>
                                </h2>
                            </div>
                            <button onClick={() => setEditingUser(null)} style={closeBtnStyle}>
                                <X size={18} color="#64748b" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveEdit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>
                                    {t.fullname} <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>
                                    {t.email} <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                                <div>
                                    <label style={labelStyle}>{t.phone}</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>{t.role}</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        disabled={isEditingSelf}
                                        style={{
                                            ...selectStyle,
                                            ...(isEditingSelf ? { cursor: 'not-allowed', opacity: 0.6 } : {}),
                                        }}
                                    >
                                        <option value="employee">employee</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>
                            </div>

                            {isEditingSelf && (
                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 16px' }}>
                                    {t.cannotChangeOwnRole}
                                </p>
                            )}

                            {/* Modal Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    style={cancelBtnStyle}
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={submitBtnStyle}
                                >
                                    <Save size={18} />
                                    {isSubmitting ? t.saving : t.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles
const thStyle = {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
};

const tdStyle = {
    padding: '10px 12px',
    fontSize: '14px',
    color: 'var(--text-primary)',
};

const actionBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
};

// --- Updated Modal UI Styles ---
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    position: 'relative',
    background: '#f1f3f6',
    borderRadius: '24px',
    padding: '32px 28px 24px 28px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
};

const topBarStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #3b82f6 0%, #ec4899 50%, #22c55e 100%)',
};

const iconBadgeStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const closeBtnStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#e2e8f0',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
};

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#475569',
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
};

const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
};

const cancelBtnStyle = {
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#e2e8f0',
    color: '#334155',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
};

const submitBtnStyle = {
    padding: '10px 24px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
};

export default EmployeeList;