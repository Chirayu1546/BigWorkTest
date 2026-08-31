import React, { useState, useEffect, useContext, useMemo } from 'react';
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
    allCategories: 'All',
    uncategorized: 'Uncategorized',
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
    allCategories: 'ทั้งหมด',
    uncategorized: 'ไม่ระบุหมวดหมู่',
  }
};

const Products = ({ lang = 'th' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  // ดึงรายชื่อหมวดหมู่ที่ไม่ซ้ำจากสินค้าทั้งหมด
  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const id = p.Category?.category_id ?? p.category_id ?? 'uncategorized';
      const name = p.Category?.category_name || t.uncategorized;
      if (!map.has(id)) map.set(id, name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products, t.uncategorized]);

  // กรองสินค้าตามหมวดหมู่ที่เลือก
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((p) => {
      const id = p.Category?.category_id ?? p.category_id ?? 'uncategorized';
      return id === selectedCategory;
    });
  }, [products, selectedCategory]);

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

      {/* Category Tabs */}
      {products.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: selectedCategory === 'all' ? '1.5px solid var(--accent-mid)' : '1.5px solid var(--border)',
              background: selectedCategory === 'all' ? 'var(--accent-light)' : 'transparent',
              color: selectedCategory === 'all' ? 'var(--accent-text)' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '700',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {t.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                border: selectedCategory === cat.id ? '1.5px solid var(--accent-mid)' : '1.5px solid var(--border)',
                background: selectedCategory === cat.id ? 'var(--accent-light)' : 'transparent',
                color: selectedCategory === cat.id ? 'var(--accent-text)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: '700',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 ? (
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
          {filteredProducts.map((product) => (
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

                  {product.Category?.category_name && (
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--accent-text)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      marginTop: '6px',
                    }}>
                      {product.Category.category_name}
                    </div>
                  )}

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