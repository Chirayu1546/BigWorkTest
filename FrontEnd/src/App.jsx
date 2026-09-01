import { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AlertProvider } from './context/AlertContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ManageProducts from './pages/ManageProducts';
import Cart from './pages/Cart';
import Invoice from './pages/Invoice';
import Profile from './pages/Profile';
import EmployeeList from './pages/EmployeeList';
import FloatingCartButton from './components/FloatingCartButton';

const Layout = ({ children, lang, setLang }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) return <>{children}</>;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar lang={lang} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        style={{
          marginLeft: collapsed ? '68px' : '224px',
          flex: 1,
          minHeight: '100vh',
          background: 'var(--bg-page)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.25s cubic-bezier(0.16,1,0.3,1), background 0.25s ease',
        }}
      >
        <Topbar lang={lang} setLang={setLang} />
        <div style={{ padding: '28px 32px', flex: 1 }}>
          {children}
        </div>
      </div>
      <FloatingCartButton />
    </div>
  );
};

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

const PublicOnly = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/products" replace /> : children;
};

const RequireAdmin = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user?.role === 'admin' ? children : <Navigate to="/products" replace />;
};

function App() {
  const [lang, setLang] = useState('th');

  return (
    <ThemeProvider>
      <Router>
        <AlertProvider>
          <AuthProvider>
            <CartProvider>
              <Layout lang={lang} setLang={setLang}>
                <Routes>
                  <Route path="/" element={<Navigate to="/products" replace />} />
                  <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
                  <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
                  <Route path="/products" element={<RequireAuth><Products lang={lang} /></RequireAuth>} />
                  <Route path="/manage-products" element={<RequireAuth><RequireAdmin><ManageProducts lang={lang} /></RequireAdmin></RequireAuth>} />
                  <Route path="/employees" element={<RequireAuth><RequireAdmin><EmployeeList lang={lang} /></RequireAdmin></RequireAuth>} />
                  <Route path="/cart" element={<RequireAuth><Cart lang={lang} /></RequireAuth>} />
                  <Route path="/invoice/:orderId" element={<RequireAuth><Invoice /></RequireAuth>} />
                  <Route path="/profile" element={<RequireAuth><Profile lang={lang} /></RequireAuth>} />
                  <Route path="*" element={<Navigate to="/products" replace />} />
                </Routes>
              </Layout>
              <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            </CartProvider>
          </AuthProvider>
        </AlertProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;