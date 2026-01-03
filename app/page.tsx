"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Shirt, Smartphone, HardDrive, Footprints, GraduationCap, Search, Moon, Sun } from 'lucide-react';
import { createClient } from 'next-sanity';

// إعدادات Sanity الخاصة بك
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

  const whatsappNumber = "212601042910"; // رقم هاتفك

  const categories = [
    { name: "الكل", icon: <Search size={20} />, color: "#333" },
    { name: "ملابس رجال", icon: <Shirt size={20} />, color: "#ff0000" },
    { name: "سراول", icon: <Smartphone size={20} style={{transform: 'rotate(180deg)'}}/>, color: "#007bff" },
    { name: "كاسكيطات", icon: <GraduationCap size={20} />, color: "#28a745" },
    { name: "سبرديلات", icon: <Footprints size={20} />, color: "#ffc107" } 
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          name, price, "imageUrl": image.asset->url, description, category
        }`);
        setItems(data);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "الكل" || item?.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const bg = isDarkMode ? '#121212' : '#ffffff';
  const text = isDarkMode ? '#ffffff' : '#333333';
  const cardBg = isDarkMode ? '#1e1e1e' : '#ffffff';

  return (
    <div style={{ backgroundColor: bg, color: text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', alignItems: 'center', borderBottom: `3px solid #ff0000`, backgroundColor: cardBg, position: 'sticky', top: 0, zIndex: 50 }}>
        <h1 style={{ color: '#ff0000', fontWeight: 'bold', margin: 0, fontSize: '1.4rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: text }}>
                {isDarkMode ? <Sun size={24} color="#ffc107" /> : <Moon size={24} color="#333" />}
            </button>
            <ShoppingCart size={24} color="#007bff" />
        </div>
      </header>

      {/* شريط البحث */}
      <div style={{ padding: '15px 15px 5px 15px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search style={{ position: 'absolute', right: '15px' }} size={18} color="#999" />
            <input 
              type="text" 
              placeholder="ابحث عن موديلك..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 45px 12px 15px', borderRadius: '30px', 
                border: `1px solid ${isDarkMode ? '#333' : '#ff0000'}`, 
                backgroundColor: cardBg, color: text, outline: 'none' 
              }} 
            />
        </div>
      </div>

      {/* الأقسام بالرموز */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '15px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '70px' }}>
            <div style={{ 
              width: '50px', height: '50px', borderRadius: '15px', 
              backgroundColor: activeCategory === cat.name ? cat.color : (isDarkMode ? '#333' : '#fff'),
              color: activeCategory === cat.name ? '#fff' : cat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${cat.color}`, transition: '0.2s'
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.7rem', marginTop: '5px', fontWeight: 'bold' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* شبكة المنتجات */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '15px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: cardBg, border: `1px solid ${isDarkMode ? '#333' : '#eee'}`, boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#fff', height: '170px', display: 'flex', alignItems: 'center' }}>
                <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.8rem', margin: '5px 0', color: text }}>{item.name}</h3>
              <p style={{ color: '#ff0000', fontWeight: 'bold', margin: 0 }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة الوصف (المعدلة لتقسيم السطور) */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: cardBg, padding: '20px', borderRadius: '25px', width: '100%', maxWidth: '400px', position: 'relative', color: text }}>
            <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 101 }}>
              <X size={20} />
            </button>
            <img src={selectedItem.imageUrl} style={{ width: '100%', borderRadius: '15px', maxHeight: '300px', objectFit: 'contain', backgroundColor: '#fff' }} />
            <h2 style={{ fontSize: '1.2rem', margin: '15px 0', textAlign: 'right' }}>{selectedItem.name}</h2>
            
            {/* عرض الوصف مقسم إلى سطور */}
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              {selectedItem.description?.split('\n').map((line: string, i: number) => (
                <div key={i} style={{ marginBottom: '8px', fontSize: '1rem', color: isDarkMode ? '#ccc' : '#666' }}>
                  {line}
                </div>
              ))}
            </div>

            <a href={`https://wa.me/${whatsappNumber}?text=أريد طلب: ${selectedItem.name}`} style={{ display: 'block', background: '#25D366', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold', marginTop: '20px' }}>
              طلب عبر واتساب
            </a>
          </div>
        </div>
      )}
    </div>
  );
}