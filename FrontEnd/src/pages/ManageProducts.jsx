import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X, Search, Package2 } from 'lucide-react';

const ManageProducts = ({ lang }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '', price: '', stock_qty: '', image_url: '', description: '',
  });

  const t = {
    title:         lang === 'en' ? 'Manage Products'    : 'จัดการสินค้า',
    subtitle:      lang === 'en' ? 'Add, edit and delete products in your store' : 'เพิ่ม แก้ไข และลบสินค้าในร้านค้าของคุณ',
    add:           lang === 'en' ? 'Add Product'        : 'เพิ่มสินค้า',
    search:        lang === 'en' ? 'Search products...' : 'ค้นหาสินค้า...',
    name:          lang === 'en' ? 'Product Name'       : 'ชื่อสินค้า',
    price:         lang === 'en' ? 'Price (฿)'          : 'ราคา (฿)',
    stock:         lang === 'en' ? 'Stock'              : 'สต็อก',
    actions:       lang === 'en' ? 'Actions'            : 'จัดการ',
    editTitle:     lang === 'en' ? 'Edit Product'       : 'แก้ไขสินค้า',
    addTitle:      lang === 'en' ? 'Add New Product'    : 'เพิ่มสินค้าใหม่',
    deleteConfirm: lang === 'en' ? 'Delete this product?' : 'คุณต้องการลบสินค้านี้ใช่ไหม?',
    save:          lang === 'en' ? 'Save'               : 'บันทึก',
    cancel:        lang === 'en' ? 'Cancel'             : 'ยกเลิก',
    imgUrl:        lang === 'en' ? 'Image URL (optional)' : 'URL รูปภาพ (ไม่บังคับ)',
    desc:          lang === 'en' ? 'Description (optional)' : 'รายละเอียดสินค้า (ไม่บังคับ)',
    empty:         lang === 'en' ? 'No products yet'   : 'ยังไม่มีสินค้า',
    emptyDesc:     lang === 'en' ? 'Click "Add Product" to create your first product.' : 'กดปุ่ม "เพิ่มสินค้า" เพื่อเริ่มต้นเพิ่มสินค้าชิ้นแรก',
    total:         lang === 'en' ? 'products total'     : 'สินค้าทั้งหมด',
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/products');
      setProducts(res.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditMode(true); setCurrentId(product.product_id);
      setFormData({
        product_name: product.product_name, price: product.price,
        stock_qty: product.stock_qty, image_url: product.image_url || '',
        description: product.description || '',
      });
    } else {
      setEditMode(false); setCurrentId(null);
      setFormData({ product_name: '', price: '', stock_qty: '', image_url: '', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ product_name: '', price: '', stock_qty: '', image_url: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editMode) {
        await axiosClient.put(`/products/${currentId}`, formData);
        toast.success(lang === 'en' ? 'Product updated!' : 'แก้ไขสินค้าสำเร็จ!');
      } else {
        await axiosClient.post('/products', formData);
        toast.success(lang === 'en' ? 'Product added!' : 'เพิ่มสินค้าสำเร็จ!');
      }
      closeModal(); fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`${t.deleteConfirm}\n"${name}"`)) {
      try {
        await axiosClient.delete(`/products/${id}`);
        toast.success(lang === 'en' ? 'Product deleted!' : 'ลบสินค้าสำเร็จ!');
        fetchProducts();
      } catch {
        toast.error('Error deleting product');
      }
    }
  };

  const filtered = products.filter(p =>
    p.product_name.toLowerCase().includes(search.toLowerCase())
  );

  const stockColor = (qty) => {
    if (qty > 10) return { bg: 'var(--success-light)', color: 'var(--success)' };
    if (qty > 0)  return { bg: 'var(--orange-light)',  color: 'var(--orange)' };
    return            { bg: 'var(--danger-light)',  color: 'var(--danger)' };
  };

  return (
    <div>
      {/* ===== PAGE HEADER ===== */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>{t.subtitle}</p>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '200px', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />
          <input
            type="text"
            className="premium-input"
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '42px', height: '42px' }}
          />
        </div>

        {/* Product count badge */}
        <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', flex: 1 }}>
          {!loading && <span style={{ color: 'var(--accent-text)' }}>{filtered.length}</span>} {t.total}
        </div>

        {/* Add button */}
        <button
          onClick={() => openModal()}
          className="btn-premium"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', height: '42px', flexShrink: 0 }}
        >
          <Plus size={16} />
          {t.add}
        </button>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 16px',
              border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
              animation: 'spin 0.7s linear infinite',
            }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px', background: 'var(--accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <Package2 size={32} style={{ color: 'var(--accent-text)' }} />
            </div>
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)', fontWeight: '800' }}>{t.empty}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>{t.emptyDesc}</p>
          </div>
        ) : (
          /* Table */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)' }}>
                  {['#', t.name, t.price, t.stock, t.actions].map((h, i) => (
                    <th key={i} style={{
                      padding: '13px 20px', textAlign: i === 4 ? 'right' : 'left',
                      fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const sc = stockColor(p.stock_qty);
                  return (
                    <tr
                      key={p.product_id}
                      style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* ID */}
                      <td style={{ padding: '16px 20px', color: 'var(--text-faint)', fontSize: '12px', fontWeight: '600', width: '48px' }}>
                        {idx + 1}
                      </td>

                      {/* Name */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          {/* Thumbnail */}
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                            background: 'var(--bg-input)', border: '1px solid var(--border)',
                            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {p.image_url
                              ? <img src={p.image_url} alt={p.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} />
                              : <Package2 size={18} style={{ color: 'var(--text-faint)' }} />
                            }
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px', marginBottom: '2px' }}>
                              {p.product_name}
                            </div>
                            {p.description && (
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px', whiteSpace: 'nowrap' }}>
                        ฿{Number(p.price).toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800',
                          background: sc.bg, color: sc.color, whiteSpace: 'nowrap',
                        }}>
                          {p.stock_qty} {lang === 'en' ? 'pcs' : 'ชิ้น'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => openModal(p)}
                          title="Edit"
                          style={{
                            background: 'var(--accent-light)', border: 'none', color: 'var(--accent-text)',
                            cursor: 'pointer', borderRadius: '8px', padding: '8px', marginRight: '8px',
                            display: 'inline-flex', alignItems: 'center', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.product_id, p.product_name)}
                          title="Delete"
                          style={{
                            background: 'var(--danger-light)', border: 'none', color: 'var(--danger)',
                            cursor: 'pointer', borderRadius: '8px', padding: '8px',
                            display: 'inline-flex', alignItems: 'center', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999, padding: '20px',
        }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)', overflow: 'visible' }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px 28px 20px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: editMode ? 'var(--orange-light)' : 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {editMode ? <Edit size={18} style={{ color: 'var(--orange)' }} /> : <Plus size={18} style={{ color: 'var(--accent-text)' }} />}
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {editMode ? t.editTitle : t.addTitle}
                </h3>
              </div>
              <button onClick={closeModal} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px', padding: '6px', display: 'flex', alignItems: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Product Name */}
              <div>
                <label style={labelStyle}>{t.name} <span style={{ color: 'var(--pink)' }}>*</span></label>
                <input
                  type="text" className="premium-input" name="product_name"
                  value={formData.product_name} onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                  placeholder={lang === 'en' ? 'e.g. iPhone 15 Pro' : 'เช่น iPhone 15 Pro'}
                  required
                />
              </div>

              {/* Price + Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>{t.price} <span style={{ color: 'var(--pink)' }}>*</span></label>
                  <input
                    type="number" step="0.01" min="0" className="premium-input" name="price"
                    value={formData.price} onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                    placeholder="0.00" required
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t.stock} <span style={{ color: 'var(--pink)' }}>*</span></label>
                  <input
                    type="number" min="0" className="premium-input" name="stock_qty"
                    value={formData.stock_qty} onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                    placeholder="0" required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label style={labelStyle}>{t.imgUrl}</label>
                <input
                  type="url" className="premium-input" name="image_url"
                  value={formData.image_url} onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                  placeholder="https://..."
                />
                {formData.image_url && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img src={formData.image_url} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} onError={e => e.target.style.display='none'} />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preview</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>{t.desc}</label>
                <textarea
                  className="premium-input" name="description"
                  value={formData.description} onChange={e => setFormData({...formData, [e.target.name]: e.target.value})}
                  placeholder={lang === 'en' ? 'Product description...' : 'รายละเอียดสินค้า...'}
                  style={{ minHeight: '90px', resize: 'vertical' }}
                />
              </div>

              {/* Footer Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button
                  type="button" onClick={closeModal}
                  style={{ background: 'transparent', border: '1.5px solid var(--border)', padding: '10px 20px', borderRadius: '12px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit', fontSize: '14px' }}
                >
                  {t.cancel}
                </button>
                <button type="submit" className="btn-premium" disabled={saving} style={{ padding: '10px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {saving
                    ? <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    : <>{editMode ? <Edit size={15}/> : <Plus size={15}/>} {t.save}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle = {
  display: 'block', fontSize: '11px', fontWeight: '800',
  color: 'var(--text-muted)', marginBottom: '7px',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

export default ManageProducts;
