import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const roleOrder = { admin: 0, user: 1 };

const translations = {
    en: {
        title: 'All Users',
        searchPlaceholder: 'Search username / full name / email',
        username: 'Username',
        fullname: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        role: 'Role',
        createdAt: 'Registered',
        loading: 'Loading...',
        noData: 'No users found',
        loadFail: 'Failed to load users',
    },
    th: {
        title: 'รายชื่อผู้ใช้ทั้งหมด',
        searchPlaceholder: 'ค้นหาชื่อผู้ใช้ / ชื่อ-นามสกุล / อีเมล',
        username: 'ชื่อผู้ใช้',
        fullname: 'ชื่อ-นามสกุล',
        email: 'อีเมล',
        phone: 'เบอร์โทร',
        role: 'บทบาท',
        createdAt: 'สมัครเมื่อ',
        loading: 'กำลังโหลด...',
        noData: 'ไม่พบข้อมูล',
        loadFail: 'โหลดข้อมูลผู้ใช้ไม่สำเร็จ',
    },
};

const EmployeeList = ({ lang = 'th' }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const t = translations[lang];

    useEffect(() => {
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
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ChevronsUpDown size={13} style={{ opacity: 0.4 }} />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={13} />
            : <ChevronDown size={13} />;
    };

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig.key) {
            // default: admin ก่อน user
            return (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
        }

        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'role') {
            valA = roleOrder[a.role] ?? 99;
            valB = roleOrder[b.role] ?? 99;
        } else if (sortConfig.key === 'created_at') {
            valA = new Date(a.created_at).getTime();
            valB = new Date(b.created_at).getTime();
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
        { key: 'email', label: t.email },
        { key: 'phone', label: t.phone },
        { key: 'role', label: t.role },
        { key: 'created_at', label: t.createdAt },
    ];

    if (loading) return <div style={{ padding: '24px' }}>{t.loading}</div>;

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
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
                                >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        {col.label}
                                        {getSortIcon(col.key)}
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
                                <td style={tdStyle}>{u.email}</td>
                                <td style={tdStyle}>{u.phone || '-'}</td>
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
                                    {new Date(u.created_at).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
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
        </div>
    );
};

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

export default EmployeeList;