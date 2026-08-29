import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      return null;
    }
  });

  const login = (userData, token, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    setUser(userData);
    otherStorage.removeItem('user');
    otherStorage.removeItem('token');
    storage.setItem('user', JSON.stringify(userData));
    storage.setItem('token', token);
  };

  const updateUser = (changes) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const updatedUser = { ...currentUser, ...changes };
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
