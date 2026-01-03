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

      {/* Categories Icons */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 20px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '75px' }}>
            <div style={{ 
              width: '55px', height: '55px', borderRadius: '18px', 
              backgroundColor: activeCategory === cat.name ? cat.color : theme.card,
              color: activeCategory === cat.name ? '#fff' : cat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${cat.color}`, transition: '0.3s'
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.75rem', marginTop: '6px', fontWeight: 'bold' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Product Grid - هاد الجزء هو اللي عدلت باش يبانو 2 منتجات فقط */}
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', // هادي كتخلي ديما 2 في السطر
          gap: '15px', 
          padding: '15px 20px' 
      }}>
        {filteredItems.