"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Search, Moon, Sun, ArrowRight, Trash2 } from 'lucide-react';
import { createClient } from 'next-sanity';

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: '', city: '', address: '' });
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, description, category,
          "imageUrl": image.asset->url,
          "moreImages": images[].asset->url
        }`);
        setItems(data);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const sendToWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city) return alert("المرجو إدخال الاسم والمدينة");
    
    const total = cart.reduce((acc, item) => acc + Number(item.price), 0);
    // تحديث النمرة الجديدة هنا بصيغة دولية صحيحة
    const whatsappNumber = "212612889129";
    
    const message = encodeURIComponent(
      `*طلب جديد BRAYOUS_SHOP* 🚀\n\n` +
      `*الاسم:* ${orderInfo.name}\n` +
      `*المدينة:* ${orderInfo.city}\n` +
      `*العنوان:* ${orderInfo.address}\n\n` +
      `*المنتجات:*\n${cart.map(i => `- ${i.name} (${i.price} DH)`).join('\n')}\n\n` +
      `*المجموع الإجمالي:* ${total} DH`
    );
    
    // استخدام wa.me لضمان عمل WhatsApp Business
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const theme = {
    bg: isDarkMode ? '#0a0a0a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    red: '#ff0000',
    card: isDarkMode ? '#1a1a1a' : '#f4f4f4',
    border: isDarkMode ? '#333' : '#eee'
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui' }}>
      
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}`, padding: '10px 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: theme.red, fontWeight: '900', fontSize: '1.5rem', margin: 0 }}>BRAYOUS</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}>
               {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: theme.red, color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>{cart.length}</span>}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
          <input 
            type="text" 
            placeholder="علاش كتقلب؟" 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 35px 12px 10px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}
          />
        </div>
      </header>

      {/* Categories Bar with Names */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '15px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ textAlign: 'center', minWidth: '70px', cursor: 'pointer' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '15px', backgroundColor: activeCategory === cat.name ? theme.red : theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{cat.icon}</div>
            <span style={{ fontSize: '0.75rem', marginTop: '6px', fontWeight: activeCategory === cat.name ? 'bold' : 'normal', display: 'block' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Grid 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 15px 15px' }}>
        {filteredItems.map((item, idx) => (
          <div key={idx} onClick={() => {setSelectedItem(item); setActiveImgIdx(0);}} style={{ background: theme.card, borderRadius: '15px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <div style={{ backgroundColor: '#fff', height: '150px', display: 'flex', alignItems: 'center' }}>
                <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '0.8rem', margin: '0 0 5px 0', height: '35px', overflow: 'hidden' }}>{item.name}</h3>
              <p style={{ color: theme.red, fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal - Optimized Image Size */}
      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '10px', position: 'sticky', top: 0, background: theme.bg, zIndex: 10 }}>
            <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: theme.text }}><ArrowRight size={28} /></button>
            <span style={{ fontWeight: 'bold' }}>تفاصيل المنتج</span>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '300px', backgroundColor: '#fff', borderRadius: '20px', padding: '10px' }}>
              <img src={activeImgIdx === 0 ? selectedItem.imageUrl : selectedItem.moreImages[activeImgIdx - 1]} style={{ width: '100%', borderRadius: '15px', objectFit: 'contain' }} />
            </div>
            {selectedItem.moreImages && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <img src={selectedItem.imageUrl} onClick={() => setActiveImgIdx(0)} style={{ width: '50px', height: '50px', borderRadius: '8px', border: activeImgIdx === 0 ? `2px solid ${theme.red}` : '1px solid #ddd' }} />
                {selectedItem.moreImages.map((img: any, i: number) => (
                  <img key={i} src={img} onClick={() => setActiveImgIdx(i + 1)} style={{ width: '50px', height: '50px', borderRadius: '8px', border: activeImgIdx === i + 1 ? `2px solid ${theme.red}` : '1px solid #ddd' }} />
                ))}
              </div>
            )}
            <div style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }}>
              <h2>{selectedItem.name}</h2>
              <p style={{ color: theme.red, fontSize: '1.6rem', fontWeight: '900' }}>{selectedItem.price} DH</p>
              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '15px' }}>
                <p style={{ lineHeight: '2', whiteSpace: 'pre-line' }}>{selectedItem.description}</p>
              </div>
              <button onClick={() => {setCart([...cart, selectedItem]); setSelectedItem(null); setIsCartOpen(true);}} style={{ width: '100%', backgroundColor: theme.red, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: 'bold', marginTop: '20px' }}>أضف إلى السلة 🛍️</button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Cart Modal */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: theme.bg, zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <h3>سلة المشتريات ({cart.length})</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: theme.text }}><X size={30}/></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {cart.length === 0 ? <p style={{ textAlign: 'center' }}>السلة فارغة</p> : 
              cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: `1px solid ${theme.border}` }}>
                  <span>{item.name} ({item.price} DH)</span>
                  <button onClick={() => removeFromCart(i)} style={{ color: 'red', background:'none', border:'none' }}><Trash2 size={20}/></button>
                </div>
              ))
            }
          </div>
          {cart.length > 0 && (
            <div style={{ padding: '20px', borderTop: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>المجموع:</span>
                <span>{cart.reduce((acc, item) => acc + Number(item.price), 0)} DH</span>
              </div>
              <button onClick={() => {setIsCartOpen(false); setShowOrderForm(true);}} style={{ width: '100%', backgroundColor: theme.red, color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: 'bold' }}>إتمام الطلب</button>
            </div>
          )}
        </div>
      )}

      {/* Order Form */}
      {showOrderForm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: theme.bg, padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>معلومات الشحن 🚚</h2>
            <input placeholder="الاسم الكامل" onChange={(e) => setOrderInfo({...orderInfo, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #ddd', color: '#000' }} />
            <input placeholder="المدينة" onChange={(e) => setOrderInfo({...orderInfo, city: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #ddd', color: '#000' }} />
            <input placeholder="العنوان" onChange={(e) => setOrderInfo({...orderInfo, address: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd', color: '#000' }} />
            <button onClick={sendToWhatsApp} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '18px', borderRadius: '15px', fontWeight: 'bold' }}>تأكيد عبر واتساب ✅</button>
            <button onClick={() => setShowOrderForm(false)} style={{ width: '100%', background: 'none', border: 'none', color: '#999', marginTop: '10px' }}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}