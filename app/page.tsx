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
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mainImage, setMainImage] = useState("");
  
  // States للتعليقات والطلب
  const [reviews, setReviews] = useState<any>({});
  const [newReview, setNewReview] = useState({ user: "", comment: "", stars: 5 });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: "", city: "", address: "", size: "" });

  const whatsappNumber = "212601042910";

  const categories = [
    { name: "الكل", icon: <Search size={20} />, color: "#333" },
    { name: "جاكيط", icon: <Shirt size={22} />, color: "#ff0000" },
    { name: "سراول", icon: <Smartphone size={22} style={{transform: 'rotate(180deg)'}}/>, color: "#007bff" },
    { name: "كاسكيطات", icon: <GraduationCap size={22} />, color: "#28a745" },
    { name: "سبرديلات", icon: <Footprints size={22} />, color: "#ffc107" } 
  ];

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

  const handleSendOrder = () => {
    if (!orderInfo.name || !orderInfo.city || !orderInfo.address) {
      alert("عافاك كمل المعلومات ديالك");
      return;
    }
    const message = `*طلب جديد من BRAYOUS*%0A%0A` +
                    `*المنتج:* ${selectedItem.name}%0A` +
                    `*الثمن:* ${selectedItem.price} DH%0A` +
                    `--------------------------%0A` +
                    `*الاسم الكامل:* ${orderInfo.name}%0A` +
                    `*المدينة:* ${orderInfo.city}%0A` +
                    `*العنوان:* ${orderInfo.address}%0A` +
                    `*المقاس:* ${orderInfo.size || 'غير محدد'}%0A`;
    
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

      <div style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
        BRAYOUS_SHOP
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px' }}>
        {items.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '150px', objectFit: 'contain', backgroundColor: '#fff' }} />
            <div style={{ padding: '8px' }}>
              <h3 style={{ fontSize: '0.7rem', height: '30px', overflow: 'hidden' }}>{item.name}</h3>
              <p style={{ color: '#ff4400', fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <button onClick={() => {setSelectedItem(null); setShowOrderForm(false);}} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 1100, background: '#eee', borderRadius: '50%', padding: '5px' }}><X size={24} color="#000" /></button>
          
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '15px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              
              {/* الصور */}
              <div style={{ flex: '1 1 300px' }}>
                <img src={mainImage} style={{ width: '100%', borderRadius: '12px', border: `1px solid ${theme.border}` }} />
                
                {/* قسم التعليقات مصغر */}
                <div style={{ marginTop: '20px', padding: '15px', border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>آراء الزبناء</h4>
                  <input type="text" placeholder="اسمك" onChange={(e) => setNewReview({...newReview, user: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '5px' }} />
                  <textarea placeholder="تعليقك" onChange={(e) => setNewReview({...newReview, comment: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '40px' }}></textarea>
                  <button onClick={() => alert('شكرا على تقييمك')} style={{ background: '#000', color: '#fff', width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px', fontSize: '0.8rem' }}>إرسال التقييم</button>
                </div>
              </div>

              {/* الوصف ومعلومات الطلب */}
              <div style={{ flex: '1 1 300px' }}>
                <h2 style={{ fontSize: '1.2rem' }}>{selectedItem.name}</h2>
                <p style={{ color: '#ff4400', fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedItem.price} DH</p>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: '15px 0' }}>{selectedItem.description}</p>

                {/* Form الطلب */}
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px', border: '2px dashed #0055ff', color: '#000' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '15px', textAlign: 'center' }}>عمر المعلومات باش نتاصلو بك:</h3>
                  <input type="text" placeholder="الاسم والنسب" onChange={(e) => setOrderInfo({...orderInfo, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                  <input type="text" placeholder="المدينة" onChange={(e) => setOrderInfo({...orderInfo, city: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                  <input type="text" placeholder="العنوان السكني" onChange={(e) => setOrderInfo({...orderInfo, address: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                  <input type="text" placeholder="المقاس (Taille)" onChange={(e) => setOrderInfo({...orderInfo, size: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
                  
                  {/* زر الواتساب الصغير في الجنب */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#25D366', marginBottom: '5px' }}>اضغط هنا لإتمام الطلب ←</span>
                    <button onClick={handleSendOrder} style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <MessageCircle size={20} /> طلب
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}