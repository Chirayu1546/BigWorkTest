import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const FloatingCartButton = () => {
    const { cartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    // ไม่ต้องแสดงเมื่ออยู่ในหน้าตะกร้าอยู่แล้ว
    if (location.pathname === '/cart') return null;

    return (
        <button
            onClick={() => navigate('/cart')}
            title="ตะกร้าสินค้า"
            style={{
                position: 'fixed',
                bottom: '32px',
                right: '32px',
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'var(--brand-gradient)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 28px var(--accent-glow, rgba(37,99,235,0.45))',
                zIndex: 900,
                transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
            <ShoppingCart size={30} />
            {cartCount > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    minWidth: '26px',
                    height: '26px',
                    padding: '0 6px',
                    borderRadius: '999px',
                    background: 'var(--danger, #ef4444)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    border: '2.5px solid var(--bg-page)',
                }}>
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </button>
    );
};

export default FloatingCartButton;