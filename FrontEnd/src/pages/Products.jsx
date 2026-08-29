import React, { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import { ShoppingCart, Package, RefreshCw } from 'lucide-react';

const translations = {
  en: {
    title: 'Our Products',
    subtitle: 'Discover our curated collection',
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    noProducts: 'No products found',
    noProductsDesc: 'There are no products available at the moment. Please check back later.',
    loading: 'Loading products…',
    failLoad: 'Failed to load products',
    loginRequired: 'Please login to add items to cart',
    addedInfo: 'Added to cart (Backend pending)',
    inStock: 'In Stock',
    outStockLabel: 'Out of Stock',
  },
  th: {
    title: 'สินค้าของเรา',
    subtitle: 'ค้นพบสินค้าคัดสรรของเรา',
    addToCart: 'เพิ่มลงตะกร้า',
    outOfStock: 'สินค้าหมด',
    noProducts: 'ไม่พบสินค้า',
    noProductsDesc: 'ขณะนี้ยังไม่มีสินค้าในระบบ กรุณากลับมาตรวจสอบภายหลัง',
    loading: 'กำลังโหลดสินค้า…',
    failLoad: 'โหลดสินค้าไม่สำเร็จ',
    loginRequired: 'กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าลงตะกร้า',
    addedInfo: 'เพิ่มลงตะกร้าแล้ว (Backend กำลังพัฒนา)',
    inStock: 'มีสินค้า',
    outStockLabel: 'สินค้าหมด',
  }
};

const Products = ({ lang = 'th' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const t = translations[lang] || translations['th'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get('/products');
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      toast.error(t.failLoad);
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning(t.loginRequired);
      return;
    }
    addToCart(product);
  };

  if (loading) return (
    <div className="loading-wrap">
      <div className="spinner-ring" />
      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t.loading}</span>
    </div>
  );

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">{t.title}</h1>
        <p className="page-subtitle">{t.subtitle}</p>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Package size={32} />
          </div>
          <div className="empty-state-title">{t.noProducts}</div>
          <p className="empty-state-desc">{t.noProductsDesc}</p>
          <button
            onClick={fetchProducts}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: '1.5px solid var(--accent-mid)',
              background: 'transparent',
              color: 'var(--accent-text)',
              fontSize: '13px',
              fontWeight: '700',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card-wrap" key={product.product_id}>
              <div className="product-card">
                {/* Image */}
                <div className="product-card-img">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.product_name} />
                  ) : (
                    <div className="no-image">
                      <Package size={32} strokeWidth={1.5} style={{ color: 'var(--text-faint)' }} />
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="product-card-body">
                  {/* Stock Badge */}
                  <span className={`stock-badge ${product.stock_qty > 0 ? 'in-stock' : 'out-stock'}`}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: product.stock_qty > 0 ? 'var(--success)' : 'var(--danger)',
                      display: 'inline-block',
                    }} />
                    {product.stock_qty > 0 ? t.inStock : t.outStockLabel}
                  </span>

                  <div className="product-card-name">{product.product_name}</div>
                  <div className="product-card-price">
                    ฿{Number(product.price).toLocaleString()}
                  </div>
                  <p className="product-card-desc">{product.description}</p>

                  {/* Footer */}
                  <div className="product-card-footer">
                    <button
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_qty <= 0}
                    >
                      {product.stock_qty > 0 ? (
                        <>
                          <ShoppingCart size={15} />
                          {t.addToCart}
                        </>
                      ) : (
                        t.outOfStock
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
