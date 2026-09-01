import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showAlert = (message) => setAlertMessage(message);
  const closeAlert = () => setAlertMessage(null);

  const addToCart = (product) => {
    if (product.stock_qty <= 0) {
      showAlert('สินค้านี้หมดสต็อกแล้ว');
      return;
    }

    let errorMessage = null;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.product_id === product.product_id);
      if (existing) {
        if (existing.quantity >= product.stock_qty) {
          errorMessage = `มีสินค้าในสต็อกเพียง ${product.stock_qty} ชิ้นเท่านั้น`;
          return prevCart;
        }
        return prevCart.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    if (errorMessage) showAlert(errorMessage);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, amount, stock) => {
    let errorMessage = null;

    setCart(prevCart => prevCart.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + amount;
        if (newQuantity < 1) return item;
        if (newQuantity > stock) {
          errorMessage = `มีสินค้าในสต็อกเพียง ${stock} ชิ้นเท่านั้น`;
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));

    if (errorMessage) showAlert(errorMessage);
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}

      {/* Error Alert Modal */}
      {alertMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
          }}
          onClick={closeAlert}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card, #fff)',
              borderRadius: '16px',
              padding: '28px 24px 24px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--danger-light, #fee2e2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: 'var(--danger, #ef4444)',
              fontWeight: '900',
            }}>
              !
            </div>
            <p style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--text-primary, #1f2937)',
              margin: '0 0 20px',
              lineHeight: 1.5,
            }}>
              {alertMessage}
            </p>
            <button
              onClick={closeAlert}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--accent, #2563eb)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};