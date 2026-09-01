import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X, Search, Package2, FolderPlus } from 'lucide-react';

const initialFormState = {
  product_name: '',
  price: '',
  stock_qty: '',
  image_url: '',
  description: '',
  category_id: '',
};

const ManageProducts = ({ lang }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // States สำหรับ Quick Add Category Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [savingCat, setSavingCat] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState('');

  const t = {
    title: lang === 'en' ? 'Manage Products' : 'จัดการสินค้า',
    subtitle: lang === 'en' ? 'Add, edit and delete products in your store' : 'เพิ่ม แก้ไข และลบสินค้าในร้านค้าของคุณ',
    add: lang === 'en' ? 'Add Product' : 'เพิ่มสินค้า',
    search: lang === 'en' ? 'Search products...' : 'ค้นหาสินค้า...',
    name: lang === 'en' ? 'Product Name' : 'ชื่อสินค้า',
    price: lang === 'en' ? 'Price (฿)' : 'ราคา (฿)',
    stock: lang === 'en' ? 'Stock' : 'สต็อก',
    category: lang === 'en' ? 'Category' : 'หมวดหมู่',
    selectCategory: lang === 'en' ? 'Select a category' : 'เลือกหมวดหมู่',
    addCategory: lang === 'en' ? '+ Add New Category' : '+ เพิ่มหมวดหมู่ใหม่',
    actions: lang === 'en' ? 'Actions' : 'จัดการ',
    editTitle: lang === 'en' ? 'Edit Product' : 'แก้ไขสินค้า',
    addTitle: lang === 'en' ? 'Add New Product' : 'เพิ่มสินค้าใหม่',
    deleteConfirm: lang === 'en' ? 'Delete this product?' : 'คุณต้องการลบสินค้านี้ใช่ไหม?',
    save: lang === 'en' ? 'Save' : 'บันทึก',
    cancel: lang === 'en' ? 'Cancel' : 'ยกเลิก',
    imgUrl: lang === 'en' ? 'Image URL (optional)' : 'URL รูปภาพ (ไม่บังคับ)',
    desc: lang === 'en' ? 'Description (optional)' : 'รายละเอียดสินค้า (ไม่บังคับ)',
    empty: lang === 'en' ? 'No products yet' : 'ยังไม่มีสินค้า',
    emptyDesc: lang === 'en' ? 'Click "Add Product" to create your first product.' : 'กดปุ่ม "เพิ่มสินค้า" เพื่อเริ่มต้นเพิ่มสินค้าชิ้นแรก',
    total: lang === 'en' ? 'products total' : 'สินค้าทั้งหมด',
    noCategory: lang === 'en' ? 'Uncategorized' : 'ไม่ระบุหมวดหมู่',
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

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get('/categories');
      setCategories(res.data);
      return res.data;
    } catch {
      toast.error('Failed to load categories');
      return [];
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditMode(true);
      setCurrentId(product.product_id);
      setFormData({
        product_name: product.product_name || '',
        price: product.price ?? '',
        stock_qty: product.stock_qty ?? '',
        image_url: product.image_url || '',
        description: product.description || '',
        category_id: product.category_id || product.Category?.category_id || '',
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock_qty: parseInt(formData.stock_qty, 10),
        category_id: formData.category_id ? Number(formData.category_id) : null,
      };

      if (editMode) {
        await axiosClient.put(`/products/${currentId}`, payload);
        toast.success(lang === 'en' ? 'Product updated!' : 'แก้ไขสินค้าสำเร็จ!');
      } else {
        await axiosClient.post('/products', payload);
        toast.success(lang === 'en' ? 'Product added!' : 'เพิ่มสินค้าสำเร็จ!');
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  // จัดการการเพิ่ม Quick Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSavingCat(true);
    try {
      const res = await axiosClient.post('/categories', { category_name: newCatName.trim() });
      toast.success(lang === 'en' ? 'Category created!' : 'เพิ่มหมวดหมู่สำเร็จ!');

      const updatedCats = await fetchCategories();
      const createdId = res.data?.category_id || res.data?.data?.category_id || updatedCats.find(c => c.category_name === newCatName.trim())?.category_id;

      if (createdId) {
        setFormData(prev => ({ ...prev, category_id: createdId }));
      }

      setNewCatName('');
      setShowCatModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSavingCat(false);
    }
  };

  const handleStartEditCategory = (cat) => {
    setEditingCatId(cat.category_id);
    setEditingCatName(cat.category_name);
  };

  const handleCancelEditCategory = () => {
    setEditingCatId(null);
    setEditingCatName('');
  };

  const handleUpdateCategory = async (catId) => {
    if (!editingCatName.trim()) return;
    try {
      await axiosClient.put(`/categories/${catId}`, { category_name: editingCatName.trim() });
      toast.success(lang === 'en' ? 'Category updated!' : 'แก้ไขหมวดหมู่สำเร็จ!');
      await fetchCategories();
      await fetchProducts(); // อัปเดตชื่อหมวดหมู่ในตารางสินค้าด้วย
      setEditingCatId(null);
      setEditingCatName('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`${lang === 'en' ? 'Delete category' : 'ต้องการลบหมวดหมู่'} "${cat.category_name}"?`)) return;
    try {
      await axiosClient.delete(`/categories/${cat.category_id}`);
      toast.success(lang === 'en' ? 'Category deleted!' : 'ลบหมวดหมู่สำเร็จ!');
      await fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
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
    (p.product_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const stockColor = (qty) => {
    if (qty > 10) return { bg: 'var(--success-light)', color: 'var(--success)' };
    if (qty > 0) return { bg: 'var(--orange-light)', color: 'var(--orange)' };
    return { bg: 'var(--danger-light)', color: 'var(--danger)' };
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

        <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', flex: 1 }}>
          {!loading && <span style={{ color: 'var(--accent-text)' }}>{filtered.length}</span>} {t.total}
        </div>

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
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)' }}>
                  {['#', t.name, t.category, t.price, t.stock, t.actions].map((h, i) => (
                    <th key={i} style={{
                      padding: '13px 20px', textAlign: i === 5 ? 'right' : 'left',
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
                      <td style={{ padding: '16px 20px', color: 'var(--text-faint)', fontSize: '12px', fontWeight: '600', width: '48px' }}>
                        {idx + 1}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                            background: 'var(--bg-input)', border: '1px solid var(--border)',
                            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.product_name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <Package2 size={18} style={{ color: 'var(--text-faint)' }} />
                            )}
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

                      <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {p.Category?.category_name || t.noCategory}
                      </td>

                      <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px', whiteSpace: 'nowrap' }}>
                        ฿{Number(p.price || 0).toLocaleString()}
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800',
                          background: sc.bg, color: sc.color, whiteSpace: 'nowrap',
                        }}>
                          {p.stock_qty} {lang === 'en' ? 'pcs' : 'ชิ้น'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => openModal(p)}
                          title="Edit"
                          style={{
                            background: 'var(--accent-light)', border: 'none', color: 'var(--accent-text)',
                            cursor: 'pointer', borderRadius: '8px', padding: '8px', marginRight: '8px',
                            display: 'inline-flex', alignItems: 'center', transition: 'all 0.15s',
                          }}
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

      {/* ===== PRODUCT MODAL ===== */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999, padding: '20px',
        }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)', overflow: 'visible' }}>
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

            <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Product Name */}
              <div>
                <label style={labelStyle}>{t.name} <span style={{ color: 'var(--pink)' }}>*</span></label>
                <input
                  type="text" className="premium-input" name="product_name"
                  value={formData.product_name} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  placeholder={lang === 'en' ? 'e.g. iPhone 15 Pro' : 'เช่น iPhone 15 Pro'}
                  required
                />
              </div>

              {/* Category Dropdown with Quick Add Button */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                  <label style={{ ...labelStyle, margin: 0 }}>{t.category}</label>
                  <button
                    type="button"
                    onClick={() => setShowCatModal(true)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent-text)',
                      fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <FolderPlus size={14} />
                    {t.addCategory}
                  </button>
                </div>
                <select
                  className="premium-input"
                  name="category_id"
                  value={formData.category_id}
                  onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">{t.selectCategory}</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price + Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>{t.price} <span style={{ color: 'var(--pink)' }}>*</span></label>
                  <input
                    type="number" step="0.01" min="0" className="premium-input" name="price"
                    value={formData.price} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    placeholder="0.00" required
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t.stock} <span style={{ color: 'var(--pink)' }}>*</span></label>
                  <input
                    type="number" min="0" className="premium-input" name="stock_qty"
                    value={formData.stock_qty} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    placeholder="0" required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label style={labelStyle}>{t.imgUrl}</label>
                <input
                  type="url" className="premium-input" name="image_url"
                  value={formData.image_url} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  placeholder="https://..."
                />
                {formData.image_url && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <img
                      key={formData.image_url}
                      src={formData.image_url}
                      alt="preview"
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preview</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>{t.desc}</label>
                <textarea
                  className="premium-input" name="description"
                  value={formData.description} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
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
                    : <>{editMode ? <Edit size={15} /> : <Plus size={15} />} {t.save}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== QUICK ADD CATEGORY MODAL ===== */}
      {/* ===== MANAGE CATEGORY MODAL ===== */}
      {showCatModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 10000, padding: '20px',
        }}
          onClick={(e) => e.target === e.currentTarget && setShowCatModal(false)}
        >
          <div className="glass-card" style={{ width: '100%', maxWidth: '440px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FolderPlus size={20} style={{ color: 'var(--accent-text)' }} />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {lang === 'en' ? 'Manage Categories' : 'จัดการหมวดหมู่'}
                </h4>
              </div>
              <button onClick={() => setShowCatModal(false)} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px', padding: '4px', display: 'flex' }}>
                <X size={16} />
              </button>
            </div>

            {/* ฟอร์มเพิ่มหมวดหมู่ใหม่ */}
            <form onSubmit={handleCreateCategory} style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <label style={labelStyle}>{lang === 'en' ? 'New Category' : 'เพิ่มหมวดหมู่ใหม่'} <span style={{ color: 'var(--pink)' }}>*</span></label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="premium-input"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder={lang === 'en' ? 'e.g. Electronics' : 'เช่น อุปกรณ์ไอที'}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-premium" disabled={savingCat} style={{ padding: '0 18px', fontSize: '13px', flexShrink: 0 }}>
                  {savingCat ? '...' : (lang === 'en' ? 'Add' : 'เพิ่ม')}
                </button>
              </div>
            </form>

            {/* รายการหมวดหมู่ทั้งหมด — แก้ไข/ลบได้ */}
            <div style={{ padding: '12px 24px 20px', overflowY: 'auto', flex: 1 }}>
              {categories.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                  {lang === 'en' ? 'No categories yet' : 'ยังไม่มีหมวดหมู่'}
                </p>
              ) : (
                categories.map((cat) => (
                  <div key={cat.category_id} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 0', borderBottom: '1px solid var(--border-light)',
                  }}>
                    {editingCatId === cat.category_id ? (
                      <>
                        <input
                          type="text"
                          className="premium-input"
                          value={editingCatName}
                          onChange={e => setEditingCatName(e.target.value)}
                          autoFocus
                          style={{ flex: 1, height: '36px', fontSize: '13px' }}
                        />
                        <button
                          onClick={() => handleUpdateCategory(cat.category_id)}
                          title={lang === 'en' ? 'Save' : 'บันทึก'}
                          style={{ background: 'var(--success-light)', border: 'none', color: 'var(--success)', cursor: 'pointer', borderRadius: '8px', padding: '7px', display: 'flex' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={handleCancelEditCategory}
                          title={t.cancel}
                          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '8px', padding: '7px', display: 'flex' }}
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{ flex: 1, fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>
                          {cat.category_name}
                        </span>
                        <button
                          onClick={() => handleStartEditCategory(cat)}
                          title="Edit"
                          style={{ background: 'var(--accent-light)', border: 'none', color: 'var(--accent-text)', cursor: 'pointer', borderRadius: '8px', padding: '7px', display: 'flex' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          title="Delete"
                          style={{ background: 'var(--danger-light)', border: 'none', color: 'var(--danger)', cursor: 'pointer', borderRadius: '8px', padding: '7px', display: 'flex' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
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