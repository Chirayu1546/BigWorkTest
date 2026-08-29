import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (product.stock_qty <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product_id === product.product_id);
      if (existing) {
        if (existing.quantity >= product.stock_qty) {
          toast.warning(`Only ${product.stock_qty} items available in stock`);
          return prevCart;
        }
        toast.success('Added to cart');
        return prevCart.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success('Added to cart');
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, amount, stock) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + amount;
        if (newQuantity < 1) return item;
        if (newQuantity > stock) {
          toast.warning(`Only ${stock} items available in stock`);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
