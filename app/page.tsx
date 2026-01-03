"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Shirt, Smartphone, Footprints, 
  GraduationCap, Search, Moon, Sun, MessageCircle, Star, Package 
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

  const whatsappNumber = "212601042910";

  // الأقسام مع الرموز الخاصة بها
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
          name, price, description, category, sizes, colors,
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

  const filteredItems = items.filter(item => 
    (activeCategory === "الكل" || item?.category === activeCategory) &&
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#000',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    border: isDarkMode ? '#333' : '#eee',
    secondaryText: isDarkMode ? '#aaa' : '#666'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui' }}>
      
      {/* WhatsApp Button */}
      <a href={`https://wa.me/${whatsappNumber}`} style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: '#25D366', color: '#fff', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 200 }}>
        <MessageCircle size={28} />
      </a>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.6rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text }}>
            {isDarkMode ? <Sun size={22} color="#ffc107" /> : <Moon size={22} />}
          </button>
          <ShoppingCart size={24} />
        </div>
      </header>

      {/* Search Bar */}
      <div style={{ padding: '15px 20px' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }} size={18} color="#999" />
          <input type="text" placeholder="قلب على الموديل اللي بغيتي..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 45px 12px 15px', borderRadius: '30px', border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`, backgroundColor: theme.card, color: theme.text, outline: 'none' }} />
        </div>
      </div>

      {/* الأقسام بالرموز (التي طلبتها) */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 20px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '75px' }}>
            <div style={{ 
              width: '55px', height: '55px', borderRadius: '18px', 
              backgroundColor: activeCategory === cat.name ? cat.color : theme.card,
              color: activeCategory === cat.name ? '#fff' : cat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${cat.color}`, transition: '0.3s',
              boxShadow: activeCategory === cat.name ? `0 4px 10px ${cat.color}44` : 'none'
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.75rem', marginTop: '6px', fontWeight: 'bold' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px', padding: '15px 20px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '12px' }}>
              <h3 style={{ fontSize: '0.85rem', marginBottom: '6px' }}>{item.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ff4400', fontWeight: 'bold' }}>{item.price} DH</span>
                <Star size={12} fill="#ffaa00" color="#ffaa00" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* صفحة المنتج الاحترافية (Modal) */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, backgroundColor: theme.card, padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, zIndex: 1010 }}>
             <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: theme.text }}><X size={28} /></button>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>تفاصيل المنتج</h2>
            <div style={{ width: '28px' }}></div> 
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', padding: '20px', maxWidth: '1200px', margin: '0 auto', gap: '30px' }}>
            {/* الصور */}
            <div style={{ flex: '1 1 450px' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${theme.border}`, marginBottom: '15px' }}>
                <img src={mainImage} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                <img src={selectedItem.imageUrl} onClick={() => setMainImage(selectedItem.imageUrl)} style={{ width: '70px', height: '70px', borderRadius: '8px', border: mainImage === selectedItem.imageUrl ? '2px solid #ff4400' : '1px solid #ddd', cursor: 'pointer', objectFit: 'cover' }} />
                {selectedItem.otherImages?.map((img: string, i: number) => (
                  <img key={i} src={img} onClick={() => setMainImage(img)} style={{ width: '70px', height: '70px', borderRadius: '8px', border: mainImage === img ? '2px solid #ff4400' : '1px solid #ddd', cursor: 'pointer', objectFit: 'cover' }} />
                ))}
              </div>
            </div>

            {/* المعلومات */}
            <div style={{ flex: '1 1 400px', textAlign: 'right' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '10px' }}>{selectedItem.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', color: '#ff4400', fontWeight: 'bold' }}>{selectedItem.price} DH</span>
                <span style={{ textDecoration: 'line-through', color: '#999' }}>{Math.round(selectedItem.price * 1.3)} DH</span>
              </div>

              {selectedItem.sizes && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '8px' }}>المقاسات:</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedItem.sizes.split(',').map((s: string) => (
                      <span key={s} style={{ padding: '6px 15px', border: `1px solid ${theme.border}`, borderRadius: '6px', fontSize: '0.9rem' }}>{s.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '15px' }}>
                <h4 style={{ marginBottom: '10px' }}>وصف المنتج:</h4>
                {selectedItem.description?.split('\n').map((line: string, i: number) => (
                  <p key={i} style={{ fontSize: '0.95rem', color: theme.secondaryText, marginBottom: '5px' }}>• {line}</p>
                ))}
              </div>

              <a href={`https://wa.me/${whatsappNumber}?text=طلب منتج: ${selectedItem.name}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#000', color: '#fff', padding: '18px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', marginTop: '30px' }}>
                <MessageCircle size={22} /> أطلب الآن عبر واتساب
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}