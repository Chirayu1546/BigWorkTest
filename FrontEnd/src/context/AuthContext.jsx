import { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

const normalizeRole = (role) => (role === 'user' ? 'employee' : role || 'employee');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const parsedUser = savedUser ? JSON.parse(savedUser) : null;
    if (!parsedUser) return null;
    return { ...parsedUser, role: normalizeRole(parsedUser.role) };
  });
  const [loading, setLoading] = useState(true);

  // ตั้งค่า token ให้ axiosClient ทุกครั้งที่แอปโหลด (รองรับ refresh หน้า)
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // login: เก็บ user ทั้งก้อนที่ backend ส่งมา (รวม profile_picture) ไม่ตัด field ทิ้ง
  const login = (userData, token, rememberMe = false) => {
    const normalizedUser = { ...userData, role: normalizeRole(userData?.role) };
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(normalizedUser));
    storage.setItem('token', token);
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    delete axiosClient.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // updateUser: merge ค่าที่เปลี่ยนเข้ากับ user เดิม ไม่ overwrite ทั้ง object
  const updateUser = (partialData) => {
    setUser((currentUser) => {
      const updated = { ...currentUser, ...partialData, role: normalizeRole(partialData?.role ?? currentUser?.role) };
      const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};