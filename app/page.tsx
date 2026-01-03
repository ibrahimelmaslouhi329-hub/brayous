"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Shirt, Smartphone, Footprints, GraduationCap, Search, Moon, Sun, MessageCircle } from 'lucide-react';
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

  const whatsappNumber = "212601042910";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          name, price, description, category, sizes, colors,
          "imageUrl": image.asset->url,
          "otherImages": images[].asset->url
        }`);
        setItems(data);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  // تحديث الصورة الرئيسية عند فتح منتج جديد
  useEffect(() => {
    if (selectedItem) setMainImage(selectedItem.imageUrl);
  }, [selectedItem]);

  const filteredItems = items.filter(item => 
    (activeCategory === "الكل" || item?.category === activeCategory) &&
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const theme = {
    bg: isDarkMode ? '#121212' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#333',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    border: isDarkMode ? '#333' : '#eee'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s' }}>
      
      {/* Floating WhatsApp Button */}
      <a href={`https://wa.me/${whatsappNumber}`} style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: '#25D366', color: '#fff', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 200 }}>
        <MessageCircle size={30} />
      </a>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', alignItems: 'center', borderBottom: '3px solid #ff0000', backgroundColor: theme.card, position: 'sticky', top: 0, zIndex: 50 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0 }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}>
            {isDarkMode ? <Sun size={24} color="#ffc107" /> : <Moon size={24} />}
          </button>
          <ShoppingCart size={24} color="#007bff" />
        </div>
      </header>

      {/* Categories & Search (نفس الكود السابق لضمان الوظائف) */}
      <div style={{ padding: '15px' }}>
        <input type="text" placeholder="بحث..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '25px', border: `1px solid #ff0000`, backgroundColor: theme.card, color: theme.text, outline: 'none' }} />
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '10px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '15px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '160px', objectFit: 'contain' }} alt={item.name} />
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.8rem' }}>{item.name}</h3>
              <p style={{ color: '#ff0000', fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Product Page (Modal) */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 150, overflowY: 'auto', padding: '20px' }}>
          <button onClick={() => setSelectedItem(null)} style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', zIndex: 160 }}>
            <X size={24} />
          </button>

          <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
            {/* Main Image View */}
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '10px', marginBottom: '15px' }}>
              <img src={mainImage} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
            </div>

            {/* Gallery (Thumbnail Images) */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
              <img src={selectedItem.imageUrl} onClick={() => setMainImage(selectedItem.imageUrl)} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: mainImage === selectedItem.imageUrl ? '2px solid #ff0000' : '1px solid #ddd' }} />
              {selectedItem.otherImages?.map((img: string, i: number) => (
                <img key={i} src={img} onClick={() => setMainImage(img)} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: mainImage === img ? '2px solid #ff0000' : '1px solid #ddd' }} />
              ))}
            </div>

            <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{selectedItem.name}</h1>
            <p style={{ color: '#ff0000', fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedItem.price} DH</p>

            {/* Sizes & Colors */}
            <div style={{ margin: '20px 0', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {selectedItem.sizes && (
                <div style={{ backgroundColor: theme.card, padding: '10px 20px', borderRadius: '10px', border: `1px solid ${theme.border}` }}>
                  <strong>المقاسات:</strong> <span style={{ marginRight: '10px' }}>{selectedItem.sizes}</span>
                </div>
              )}
              {selectedItem.colors && (
                <div style={{ backgroundColor: theme.card, padding: '10px 20px', borderRadius: '10px', border: `1px solid ${theme.border}` }}>
                  <strong>الألوان:</strong> <span style={{ marginRight: '10px' }}>{selectedItem.colors}</span>
                </div>
              )}
            </div>

            {/* Divided Description */}
            <div style={{ marginTop: '20px', borderTop: `1px solid ${theme.border}`, paddingTop: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>وصف المنتج:</h3>
              {selectedItem.description?.split('\n').map((line: string, i: number) => (
                <p key={i} style={{ color: isDarkMode ? '#ccc' : '#555', lineHeight: '1.6', marginBottom: '8px' }}>{line}</p>
              ))}
            </div>

            <a href={`https://wa.me/${whatsappNumber}?text=أريد طلب: ${selectedItem.name}`} style={{ display: 'block', backgroundColor: '#25D366', color: '#fff', textAlign: 'center', padding: '18px', borderRadius: '15px', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', marginTop: '30px', marginBottom: '50px' }}>
              طلب عبر واتساب الآن
            </a>
          </div>
        </div>
      )}
    </div>
  );
}