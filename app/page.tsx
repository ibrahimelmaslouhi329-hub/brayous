"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Search, Moon, Sun, ArrowRight } from 'lucide-react';
import { createClient } from 'next-sanity';

// إصلاح مشكل الـ Build Error
export const dynamic = 'force-dynamic';

const client = createClient({
  projectId: "t6a3pwpc", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// الأيقونات والتصنيفات اللي طلبتي
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
  const [activeCategory, setActiveCategory] = useState("الكل"); // حالة الصنف المختار
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: '', city: '', address: '' });
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, oldPrice, description, category,
          sizes, colors, "imageUrl": image.asset->url
        }`);
        setItems(data);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const sendToWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city) return alert("عمر معلومات الشحن");
    const total = cart.reduce((acc, item) => acc + Number(item.price), 0) * (1 - discount);
    const whatsappNumber = "212601042910";
    const message = encodeURIComponent(
      `*طلب جديد BRAYOUS_SHOP* 🚀\n\n*الاسم:* ${orderInfo.name}\n*المدينة:* ${orderInfo.city}\n*السلعة:* ${cart.map(i => i.name).join(', ')}\n*المجموع:* ${total.toFixed(2)} DH`
    );
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`, '_blank');
  };

  const theme = {
    bg: isDarkMode ? '#0a0a0a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    red: '#ff0000',
    card: isDarkMode ? '#1a1a1a' : '#f4f4f4',
    border: isDarkMode ? '#333' : '#eee'
  };

  // تصفية المنتجات بناءً على البحث + الصنف المختار
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', fontFamily: 'system-ui' }}>
      
      {/* Header & Search */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}`, padding: '10px 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: theme.red, fontWeight: '900', fontSize: '1.5rem', margin: 0 }}>BRAYOUS</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}><Sun size={22} /></button>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 35px 12px 10px', borderRadius: '10px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }}
          />
        </div>
      </header>

      {/* شريط التصنيفات (الأيقونات الرسمية) */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '15px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            onClick={() => setActiveCategory(cat.name)}
            style={{ 
              textAlign: 'center', 
              cursor: 'pointer', 
              minWidth: '70px',
              transition: '0.3s',
              transform: activeCategory === cat.name ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <div style={{ 
              width: '55px', height: '55px', borderRadius: '15px', 
              backgroundColor: activeCategory === cat.name ? theme.red : theme.card, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '1.5rem', marginBottom: '5px',
              boxShadow: activeCategory === cat.name ? '0 4px 10px rgba(255,0,0,0.3)' : 'none'
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: activeCategory === cat.name ? 'bold' : 'normal' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Grid المنتجات 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 15px 15px' }}>
        {filteredItems.map((item, idx) => (
          <div key={idx} onClick={() => setSelectedItem(item)} style={{ background: theme.card,