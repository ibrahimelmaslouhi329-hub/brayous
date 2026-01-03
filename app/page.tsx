"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Search, Moon, Sun, Trash2, Star } from 'lucide-react';
import { createClient } from 'next-sanity';

// التصحيح: revalidate خاصها تكون رقم ماشي Function
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
      } catch (error) { console.error("Error fetching:", error); }
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
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', backgroundColor: theme.bg, position: 'sticky', top: 0, zIndex: 100, borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ color: theme.redBrand, fontWeight: '900', margin: 0 }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
           <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}>
             {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
           </button>
           <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: theme.redBrand, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '50%' }}>{cart.length}</span>}
           </div>
        </div>
      </header>

      {/* Hero Red Banner */}
      <div style={{ backgroundColor: theme.redBrand, color: '#fff', padding: '18px', textAlign: 'center', fontWeight: '900', fontSize: '1.6rem' }}>
        BRAYOUS_SHOP
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '20px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ textAlign: 'center', cursor: 'pointer', minWidth: '70px' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: activeCategory === cat.name ? theme.redBrand : theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{cat.icon}</div>
            <span style={{ fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px' }}>
        {items.filter(i => (activeCategory === "الكل" || i.category === activeCategory)).map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '15px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <div style={{ height: '160px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={item.imageUrl} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '12px' }}>
              <h3 style={{ fontSize: '0.85rem', margin: 0, height: '35px', overflow: 'hidden' }}>{item.name}</h3>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: theme.redBrand, fontWeight: 'bold' }}>{item.price} DH</span>
                {item.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.75rem' }}>{item.oldPrice} DH</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal تفاصيل المنتج */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, backgroundColor: theme.bg }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{width: 28}}></div>
          </div>
          
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <img src={mainImage} style={{ width: '100%', borderRadius: '20px', backgroundColor: '#fff', border: `1px solid ${theme.border}` }} />
            
            <h2 style={{ fontSize: '1.4rem', margin: '20px 0 10px' }}>{selectedItem.name}</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: theme.redBrand, fontSize: '1.8rem', fontWeight: '900' }}>{selectedItem.price} DH</span>
                {selectedItem.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through' }}>{selectedItem.oldPrice} DH</span>}
            </div>

            {/* مربعات الطايات */}
            {selectedItem.sizes && selectedItem.sizes.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>المقاسات:</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {selectedItem.sizes.map((s: string) => (
                    <div key={s} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`, borderRadius: '8px', backgroundColor: theme.card, fontWeight: 'bold' }}>{s}</div>
                  ))}
                </div>
              </div>
            )}

            {/* دوائر الألوان */}
            {selectedItem.colors && selectedItem.colors.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>الألوان:</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {selectedItem.colors.map((c: string) => (
                    <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ 
                        width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd',
                        backgroundColor: c.includes('حمر') ? 'red' : c.includes('كحل') ? 'black' : c.includes('صفر') ? 'yellow' : c 
                      }} />
                      <span style={{ fontSize: '0.7rem' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7', borderTop: `1px solid ${theme.border}`, paddingTop: '20px' }}>{selectedItem.description}</p>
            
            <button onClick={() => {setCart([...cart, selectedItem]); setSelectedItem(null); setIsCartOpen(true);}} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '20px' }}>إضافة إلى السلة</button>
          </div>
        </div>
      )}
    </div>
  );
}