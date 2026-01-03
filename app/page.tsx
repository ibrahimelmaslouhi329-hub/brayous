"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Search, Moon, Sun, Trash2, Star } from 'lucide-react';
import { createClient } from 'next-sanity';

// منع التخزين المؤقت لضمان ظهور التعديلات فوراً
export const revalidate = 0;

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
  const [mainImage, setMainImage] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, oldPrice, description, category,
          sizes, colors,
          "imageUrl": image.asset->url,
          "otherImages": images[].asset->url
        }`);
        setItems(data);
      } catch (error) { console.error("Error fetching data:", error); }
    };
    fetchData();
  }, []);

  useEffect(() => { if (selectedItem) setMainImage(selectedItem.imageUrl); }, [selectedItem]);

  const theme = {
    bg: isDarkMode ? '#0a0a0a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    card: isDarkMode ? '#1a1a1a' : '#f9f9f9',
    redBrand: '#ff0000',
    border: isDarkMode ? '#333' : '#eee'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui, sans-serif', transition: '0.3s' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', backgroundColor: theme.bg, position: 'sticky', top: 0, zIndex: 100, borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ color: theme.redBrand, fontWeight: '900', margin: 0, fontSize: '1.5rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
           <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer' }}>
             {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
           </button>
           <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: theme.redBrand, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '50%' }}>{cart.length}</span>}
           </div>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{ backgroundColor: theme.redBrand, color: '#fff', padding: '20px', textAlign: 'center', fontWeight: '900', fontSize: '1.6rem' }}>
        BRAYOUS_SHOP
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px' }}>
        {items.filter(i => (activeCategory === "الكل" || i.category === activeCategory)).map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${theme.border}` }}>
            <div style={{ height: '160px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={item.imageUrl} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '12px' }}>
              <h3 style={{ fontSize: '0.85rem', margin: 0, height: '35px', overflow: 'hidden' }}>{item.name}</h3>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: theme.redBrand, fontWeight: 'bold', fontSize: '1rem' }}>{item.price} DH</span>
                {item.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.75rem' }}>{item.oldPrice} DH</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal تفاصيل المنتج المعدل */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, backgroundColor: theme.bg }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong style={{fontSize: '1.1rem'}}>تفاصيل المنتج</strong>
            <div style={{width: 28}}></div>
          </div>
          
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '10px', marginBottom: '20px' }}>
                <img src={mainImage} style={{ width: '100%', borderRadius: '15px', objectFit: 'contain' }} alt={selectedItem.name} />
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{selectedItem.name}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <span style={{ color: theme.redBrand, fontSize: '1.8rem', fontWeight: '900' }}>{selectedItem.price} DH</span>
                {selectedItem.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '1.1rem' }}>{selectedItem.oldPrice} DH</span>}
            </div>

            {/* الإضافة 1: الطايات على شكل مربعات */}
            {selectedItem.sizes && selectedItem.sizes.length > 0 && (
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', fontWeight: 'bold' }}>المقاسات المتوفرة:</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {selectedItem.sizes.map((s: string) => (
                    <div key={s} style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${theme.border}`, borderRadius: '10px', fontWeight: 'bold', fontSize: '0.9rem', backgroundColor: theme.card }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الإضافة 2: الألوان على شكل دوائر */}
            {selectedItem.colors && selectedItem.colors.length > 0 && (
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', fontWeight: 'bold' }}>الألوان المتوفرة:</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {selectedItem.colors.map((c: string) => (
                    <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        <div style={{ 
                            width: '35px', 
                            height: '35px', 
                            borderRadius: '50%', 
                            backgroundColor: c.toLowerCase() === 'كحل' || c.toLowerCase() === 'أسود' ? 'black' : 
                                             c.toLowerCase() === 'حمر' || c.toLowerCase() === 'أحمر' ? 'red' : 
                                             c.toLowerCase() === 'صفر' || c.toLowerCase() === 'أصفر' ? 'yellow' : 
                                             c.toLowerCase() === 'بيض' || c.toLowerCase() === 'أبيض' ? 'white' : c,
                            border: '2px solid #ddd',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }} />
                        <span style={{ fontSize: '0.75rem' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '20px', marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '10px', color: theme.redBrand }}>وصف المنتج:</h4>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7', fontSize: '0.95rem', opacity: 0.9 }}>{selectedItem.description}</p>
            </div>

            <button onClick={() => {setCart([...cart, selectedItem]); setSelectedItem(null); setIsCartOpen(true);}} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,0,0,0.3)' }}>إضافة إلى السلة 🛒</button>
          </div>
        </div>
      )}
    </div>
  );
}