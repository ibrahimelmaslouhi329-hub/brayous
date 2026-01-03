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
      alert("عافاك كمل المعلومات ديالك");
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
    blueBar: '#0055ff',
    secondaryText: isDarkMode ? '#aaa' : '#666' // تأكدت أنها موجودة هنا
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', alignItems: 'center', backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.4rem' }}>BRAYOUS</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* الشريط الأزرق الكبير */}
      <div style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '25px 10px', textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', textTransform: 'uppercase' }}>
        BRAYOUS_SHOP
      </div>

      {/* Grid المنتجات */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px' }}>
        {items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '160px', objectFit: 'contain', backgroundColor: '#fff' }} />
            <div style={{ padding: '8px' }}>
              <h3 style={{ fontSize: '0.75rem', height: '32px', overflow: 'hidden' }}>{item.name}</h3>
              <p style={{ color: '#ff4400', fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* تفاصيل المنتج */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, z_index: 1000, overflowY: 'auto', paddingBottom: '50px' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, backgroundColor: theme.card }}>
            <button onClick={() => {setSelectedItem(null); setShowOrderForm(false);}} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{width: 28}}></div>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {/* الصور والتعليقات (جهة اليمين) */}
                <div style={{ flex: '1 1 300px' }}>
                   <img src={mainImage} style={{ width: '100%', borderRadius: '12px', border: `1px solid ${theme.border}` }} />
                   <div style={{ marginTop: '20px', padding: '15px', backgroundColor: theme.card, borderRadius: '10px', border: `1px solid ${theme.border}` }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>آراء الزبناء</h4>
                      <p style={{ fontSize: '0.8rem', color: theme.secondaryText }}>لا توجد تعليقات بعد.</p>
                   </div>
                </div>

                {/* الوصف وزر الطلب (جهة اليسار) */}
                <div style={{ flex: '1 1 300px' }}>
                   <h2 style={{ fontSize: '1.5rem' }}>{selectedItem.name}</h2>
                   <p style={{ color: '#ff4400', fontSize: '2rem', fontWeight: 'bold' }}>{selectedItem.price} DH</p>
                   <p style={{ margin: '15px 0', color: theme.secondaryText, whiteSpace: 'pre-line' }}>{selectedItem.description}</p>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '30px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: theme.blueBar, marginBottom: '5px' }}>للطلب إضغط هنا ←</span>
                      <button onClick={() => setShowOrderForm(true)} style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        <MessageCircle size={24} /> طلب عبر واتساب
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* نافذة الفورم (Pop-up) */}
      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '15px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>معلومات الطلب</h3>
            <input type="text" placeholder="الاسم الكامل" onChange={(e) => setOrderInfo({...orderInfo, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <input type="text" placeholder="المدينة" onChange={(e) => setOrderInfo({...orderInfo, city: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <input type="text" placeholder="العنوان" onChange={(e) => setOrderInfo({...orderInfo, address: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <input type="text" placeholder="المقاس (Taille)" onChange={(e) => setOrderInfo({...orderInfo, size: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <button onClick={handleFinalWhatsApp} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>إرسال الطلب</button>
            <button onClick={() => setShowOrderForm(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', color: theme.secondaryText }}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}