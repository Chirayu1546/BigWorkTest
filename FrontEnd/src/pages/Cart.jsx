import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus } from 'lucide-react';

const translations = {
  en: {
    title: 'Shopping Cart',
    empty: 'Your cart is empty',
    continue: 'Continue Shopping',
    checkout: 'Proceed to Checkout',
    total: 'Total',
    price: 'Price',
    qty: 'Quantity',
    processing: 'Processing...',
  },
  th: {
    title: 'ตะกร้าสินค้า',
    empty: 'ตะกร้าสินค้าของคุณว่างเปล่า',
    continue: 'เลือกซื้อสินค้าต่อ',
    checkout: 'ดำเนินการสั่งซื้อ',
    total: 'ยอดรวม',
    price: 'ราคา',
    qty: 'จำนวน',
    processing: 'กำลังดำเนินการ...',
  }
};

const Cart = ({ lang = 'th' }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const t = translations[lang] || translations['th'];

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user) {
      toast.error('Please login to checkout');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }))
      };

      const res = await axiosClient.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully!');
      
      // Navigate to invoice with order data
      navigate(`/invoice/${res.data.order_id}`, { state: { order: res.data } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '20px' }}>
        <ShoppingCart size={64} style={{ color: 'var(--text-faint)' }} />
        <h2 style={{ color: 'var(--text-muted)' }}>{t.empty}</h2>
        <button onClick={() => navigate('/products')} className="btn-premium">
          {t.continue}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>
        {t.title}
      </h2>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Cart Items */}
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map(item => (
            <div key={item.product_id} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
              
              {/* Product Image */}
              <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ShoppingCart size={24} style={{ color: 'var(--text-faint)' }} />
                )}
              </div>

              {/* Product Info */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: 'var(--text-primary)' }}>{item.product_name}</h4>
                <div style={{ color: 'var(--accent)', fontWeight: '700' }}>฿{Number(item.price).toLocaleString()}</div>
              </div>

              {/* Quantity Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-input)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <button 
                  onClick={() => updateQuantity(item.product_id, -1, item.stock_qty)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', minWidth: '20px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button 
                  onClick={() => updateQuantity(item.product_id, 1, item.stock_qty)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  ฿{(Number(item.price) * item.quantity).toLocaleString()}
                </div>
                <button 
                  onClick={() => removeFromCart(item.product_id)}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass-card" style={{ flex: '0 0 320px', padding: '24px', position: 'sticky', top: '100px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
            <span>Items ({cart.length})</span>
            <span>฿{cartTotal.toLocaleString()}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '18px' }}>{t.total}</span>
            <span style={{ fontWeight: '800', color: 'var(--accent)', fontSize: '20px' }}>฿{cartTotal.toLocaleString()}</span>
          </div>

          <button 
            onClick={handleCheckout} 
            disabled={loading}
            className="btn-premium" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px' }}
          >
            {loading ? <span className="spinner-border spinner-border-sm" /> : <><ShoppingCart size={18} /> {t.checkout} <ArrowRight size={18} /></>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
