"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Shirt, Smartphone, Footprints, 
  GraduationCap, Search, Moon, Sun, MessageCircle, Star 
} from 'lucide-react';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: "t6a3pwpc", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mainImage, setMainImage] = useState("");
  
  // States للطلب (Form)
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: "", city: "", address: "", size: "" });

  const whatsappNumber = "212601042910";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, description, category, sizes, colors,
          "imageUrl": image.asset->url,
          "otherImages": images[].asset->url
        }`);
        setItems(data);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedItem) setMainImage(selectedItem.imageUrl);
  }, [selectedItem]);

  const handleFinalWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city || !orderInfo.address) {
      alert("عافاك كمل المعلومات ديالك باش نقدروا نتواصلوا معك");
      return;
    }
    const message = `*طلب جديد من BRAYOUS*%0A%0A` +
                    `*المنتج:* ${selectedItem.name}%0A` +
                    `*الثمن:* ${selectedItem.price} DH%0A` +
                    `--------------------------%0A` +
                    `*الاسم:* ${orderInfo.name}%0A` +
                    `*المدينة:* ${orderInfo.city}%0A` +
                    `*العنوان:* ${orderInfo.address}%0A` +
                    `*المقاس:* ${orderInfo.size || 'عادي'}%0A`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#000',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    border: isDarkMode ? '#333' : '#eee',
    blueBar: '#0055ff'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui' }}>
      
      {/* Header & Blue Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', alignItems: 'center', backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.4rem' }}>BRAYOUS</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}><Sun size={20} /></button>
      </header>

      <div style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '20px 10px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem' }}>
        BRAYOUS_SHOP
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px' }}>
        {items.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '160px', objectFit: 'contain', backgroundColor: '#fff' }} alt={item.name} />
            <div style={{ padding: '8px' }}>
              <h3 style={{ fontSize: '0.75rem', height: '32px', overflow: 'hidden' }}>{item.name}</h3>
              <p style={{ color: '#ff4400', fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, backgroundColor: theme.card, zIndex: 1100 }}>
            <button onClick={() => {setSelectedItem(null); setShowOrderForm(false);}}><X size={28} color={theme.text} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{width: 28}}></div>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '15px' }}>
            <img src={mainImage} style={{ width: '100%', borderRadius: '12px', marginBottom: '15px' }} />
            <h2 style={{ fontSize: '1.3rem' }}>{selectedItem.name}</h2>
            <p style={{ color: '#ff4400', fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedItem.price} DH</p>
            <p style={{ margin: '15px 0', color: theme.secondaryText }}>{selectedItem.description}</p>

            {/* زر الواتساب الصغير مع نص "طلب" */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '30px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.blueBar, marginBottom: '5px' }}>للطلب إضغط هنا ←</span>
              <button 
                onClick={() => setShowOrderForm(true)}
                style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
              >
                <MessageCircle size={24} /> طلب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal (كيطلع فاش تكليكي على واتساب) */}
      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '15px', width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setShowOrderForm(false)} style={{ position: 'absolute', top: '10px', left: '10px' }}><X size={24} /></button>
            
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: theme.blueBar }}>معلومات الإرسال</h3>
            
            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>الاسم الكامل:</label>
            <input type="text" placeholder="مثال: محمد العلوي" onChange={(e) => setOrderInfo({...orderInfo, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            
            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>المدينة:</label>
            <input type="text" placeholder="الدار البيضاء" onChange={(e) => setOrderInfo({...orderInfo, city: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            
            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>العنوان السكني:</label>
            <input type="text" placeholder="الحي، رقم المنزل..." onChange={(e) => setOrderInfo({...orderInfo, address: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            
            <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>المقاس (Taille/Size):</label>
            <input type="text" placeholder="L, XL, 42..." onChange={(e) => setOrderInfo({...orderInfo, size: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            
            <button 
              onClick={handleFinalWhatsApp}
              style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              إرسال الطلب عبر واتساب <MessageCircle size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}