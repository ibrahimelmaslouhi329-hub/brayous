"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Moon, Sun, Trash2 } from 'lucide-react';
import { createClient } from 'next-sanity';

// هادي كتحل مشكل الـ Build Error اللي في الصورة رقم 4 و 8
export const dynamic = 'force-dynamic';

const client = createClient({
  projectId: "t6a3pwpc", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const categories = [
  { name: "الكل", icon: "🛍️" },
  { name: "جاكيط", icon: "🧥" },
  { name: "سروال", icon: "👖" },
  { name: "قبية", icon: "👕" },
  { name: "طرابش", icon: "🧢" },
  { name: "سيرڤيت", icon: "🏃" },
];

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: '', city: '', address: '' });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, oldPrice, description, category,
          sizes, colors, "imageUrl": image.asset->url
        }`);
        setItems(data);
      } catch (error) { console.error("Sanity Error:", error); }
    };
    fetchData();
  }, []);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "BRAYOUS10") {
      setDiscount(0.10);
      alert("تم تطبيق خصم 10% ✅");
    } else {
      alert("كود غير صحيح ❌");
    }
  };

  const sendToWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city) return alert("عمر المعلومات عافاك");
    
    const subtotal = cart.reduce((acc, item) => acc + Number(item.price), 0);
    const finalTotal = subtotal * (1 - discount);
    
    // إصلاح مشكل الواتساب (التصويرة رقم 9): الرقم بدون زائد وبدون مسافات
    const whatsappNumber = "212601042910"; 
    
    const message = encodeURIComponent(
      `*طلب جديد من BRAYOUS_SHOP* 🚀\n\n` +
      `*الاسم:* ${orderInfo.name}\n` +
      `*المدينة:* ${orderInfo.city}\n` +
      `*العنوان:* ${orderInfo.address}\n\n` +
      `*السلعة:* \n${cart.map(i => `- ${i.name} (${i.price} DH)`).join('\n')}\n\n` +
      `*المجموع:* ${finalTotal.toFixed(2)} DH` + 
      (discount > 0 ? `\n*(تم تطبيق خصم 10%)*` : "")
    );

    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`, '_blank');
  };

  const theme = {
    bg: isDarkMode ? '#0a0a0a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    red: '#ff0000',
    card: isDarkMode ? '#1a1a1a' : '#f9f9f9',
    border: isDarkMode ? '#333' : '#eee'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ color: theme.red, fontWeight: '900', margin: 0 }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}>
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
          <div onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer', position: 'relative' }}>
            <ShoppingCart />
            {cart.length > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: theme.red, color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>{cart.length}</span>}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ backgroundColor: theme.red, color: '#fff', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
        BRAYOUS_SHOP
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '20px' }}>
        {categories.map(cat => (
          <div key={cat.name} style={{ textAlign: 'center', minWidth: '60px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{cat.icon}</div>
            <span style={{ fontSize: '0.7rem' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' }}>
        {items.map((item, idx) => (
          <div key={idx} onClick={() => setSelectedItem(item)} style={{ background: theme.card, borderRadius: '15px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '0.8rem', margin: '0 0 5px 0' }}>{item.name}</h3>
              <p style={{ color: theme.red, fontWeight: 'bold', margin: 0 }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal تفاصيل المنتج */}
      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, background: theme.bg, zIndex: 1000, padding: '20px', overflowY: 'auto' }}>
          <button onClick={() => setSelectedItem(null)} style={{ float: 'left' }}><X size={30} /></button>
          <img src={selectedItem.imageUrl} style={{ width: '100%', borderRadius: '15px', marginBottom: '20px' }} />
          <h2>{selectedItem.name}</h2>
          <p style={{ fontSize: '1.5rem', color: theme.red, fontWeight: 'bold' }}>{selectedItem.price} DH</p>
          
          {/* طايات مربعات */}
          {selectedItem.sizes && (
            <div style={{ margin: '20px 0' }}>
              <h4>المقاسات:</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedItem.sizes.map((s:any) => <div key={s} style={{ width: '40px', height: '40px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>{s}</div>)}
              </div>
            </div>
          )}

          {/* ألوان دوائر */}
          {selectedItem.colors && (
            <div style={{ margin: '20px 0' }}>
              <h4>الألوان:</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedItem.colors.map((c:any) => <div key={c} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: c.includes('حمر') ? 'red' : c.includes('كحل') ? 'black' : c }} />)}
              </div>
            </div>
          )}

          <button onClick={() => {setCart([...cart, selectedItem]); setSelectedItem(null); setIsCartOpen(true);}} style={{ width: '100%', background: theme.red, color: '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>إضافة للسلة</button>
        </div>
      )}

      {/* مودال السلة والشحن */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: theme.bg, zIndex: 2000, padding: '20px', overflowY: 'auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
             <h3>سلة المشتريات ({cart.length})</h3>
             <button onClick={() => setIsCartOpen(false)}><X /></button>
          </header>

          {cart.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
              <span>{item.name}</span>
              <strong>{item.price} DH</strong>
            </div>
          ))}

          {/* خانة كود برومو */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '5px' }}>
            <input placeholder="كود الخصم" onChange={(e) => setPromoCode(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <button onClick={handleApplyPromo} style={{ background: '#000', color: '#fff', padding: '0 15px', borderRadius: '8px' }}>تطبيق</button>
          </div>

          <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', background: theme.red, color: '#fff', padding: '18px', borderRadius: '12px', marginTop: '20px', fontWeight: 'bold' }}>إتمام الطلب 🛍️</button>
        </div>
      )}

      {/* فورم معلومات الشحن */}
      {showOrderForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: theme.bg, padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center' }}>معلومات الشحن 🚚</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <input placeholder="الاسم الكامل" onChange={(e) => setOrderInfo({...orderInfo, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
              <input placeholder="المدينة" onChange={(e) => setOrderInfo({...orderInfo, city: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
              <input placeholder="العنوان" onChange={(e) => setOrderInfo({...orderInfo, address: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            </div>
            <button onClick={sendToWhatsApp} style={{ width: '100%', background: '#25D366', color: '#fff', padding: '18px', borderRadius: '12px', marginTop: '20px', fontWeight: 'bold' }}>تأكيد عبر واتساب ✅</button>
            <button onClick={() => setShowOrderForm(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#999', marginTop: '10px' }}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}