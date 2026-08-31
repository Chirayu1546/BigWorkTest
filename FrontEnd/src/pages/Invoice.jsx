import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (order?.order_id === Number(orderId)) return;

    const loadOrder = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'ไม่สามารถโหลดใบสั่งขายได้');
        navigate('/products', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [order?.order_id, orderId, navigate]);

  if (loading) return <div className="loading-wrap"><div className="spinner-ring" /></div>;
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* Non-printable controls */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button onClick={() => navigate('/products')} className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
          <ArrowLeft size={16} /> กลับสู่ร้านค้า
        </button>
        <button onClick={handlePrint} className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Printer size={16} /> พิมพ์ใบสั่งขาย
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div className="invoice-container" style={{
        background: '#ffffff', // Force white background for printing
        color: '#000000', // Force black text
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: "'Inter', sans-serif"
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eeeeee', paddingBottom: '24px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#1565c0' }}>ใบสั่งขาย</h1>
            <div style={{ fontSize: '14px', color: '#555555' }}>เลขที่คำสั่งซื้อ: {order.order_no}</div>
            <div style={{ fontSize: '14px', color: '#555555' }}>วันที่: {new Date(order.order_date || order.created_at).toLocaleDateString('th-TH')}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>บริษัท ออนไลน์สโตร์ จำกัด</h2>
            <div style={{ fontSize: '14px', color: '#555555' }}>123 ถนนอีคอมเมิร์ซ<br />กรุงเทพฯ 10110<br />support@onlinestore.com</div>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', borderBottom: '1px solid #eeeeee', paddingBottom: '4px' }}>เรียกเก็บเงินจาก:</h3>
          <div style={{ fontSize: '14px' }}>
            <strong>{order.User?.full_name || order.User?.username || `ลูกค้า #${order.user_id}`}</strong><br />
            {order.shipping_address && <>{order.shipping_address}<br /></>}
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dddddd' }}>รายการ</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dddddd' }}>จำนวน</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dddddd' }}>ราคาต่อหน่วย</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dddddd' }}>ยอดรวม</th>
            </tr>
          </thead>
          <tbody>
            {order.OrderItems?.map((item) => (
              <tr key={item.order_item_id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eeeeee' }}>
                  {item.product_name || item.Product?.product_name || `สินค้า #${item.product_id}`}
                </td>
                <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eeeeee' }}>{item.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eeeeee' }}>฿{Number(item.unit_price).toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eeeeee' }}>฿{Number(item.subtotal).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eeeeee' }}>
              <span>ยอดรวม:</span>
              <span>฿{Number(order.total_amount).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eeeeee' }}>
              <span>ภาษี (0%):</span>
              <span>฿0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 'bold', fontSize: '18px' }}>
              <span>ยอดสุทธิ:</span>
              <span style={{ color: '#1565c0' }}>฿{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#777777', borderTop: '1px solid #eeeeee', paddingTop: '16px' }}>
          ขอบคุณที่ใช้บริการ!<br />
          หากมีข้อสงสัยเกี่ยวกับใบสั่งขายนี้ กรุณาติดต่อ support@onlinestore.com<br />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
};

export default Invoice;