"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Shirt, Smartphone, hardDrive, Footprints, GraduationCap, Search } from 'lucide-react';
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

  const whatsappNumber = "212601042910"; 

  // الأقسام مع الرموز ديالها والألوان
  const categories = [
    { name: "الكل", icon: <Search size={20} />, color: "#333" },
    { name: "ملابس رجال", icon: <Shirt size={20} />, color: "#ff0000" }, // أحمر
    { name: "سراول", icon: <Smartphone size={20} style={{transform: 'rotate(180deg)'}}/>, color: "#007bff" }, // أزرق
    { name: "كاسكيطات", icon: <GraduationCap size={20} />, color: "#28a745" }, // أخضر
    { name: "سبرديلات", icon: <Footprints size={20} />, color: "#ffc107" } // أصفر/برتقالي
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

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: 'sans-serif' }}>
      
      {/* Header - أبيض وأحمر */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', alignItems: 'center', borderBottom: '3px solid #ff0000', backgroundColor: '#fff' }}>
        <h1 style={{ color: '#ff0000', fontWeight: 'bold', margin: 0, fontSize: '1.5rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
            <ShoppingCart size={24} color="#007bff" /> {/* أيقونة زرقاء */}
        </div>
      </header>

      {/* Categories Bar - رموز ملونة */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '15px', backgroundColor: '#f8f9fa' }}>
        {categories.map(cat => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '60px' }}>
            <div style={{ 
              width: '50px', height: '50px', borderRadius: '15px', 
              backgroundColor: activeCategory === cat.name ? cat.color : '#fff',
              color: activeCategory === cat.name ? '#fff' : cat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${cat.color}`, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.7rem', marginTop: '5px', fontWeight: 'bold', color: '#333' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Grid المنتجات */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '15px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid #eee', boxShadow: '0 3px 6px rgba(0,0,0,0.05)' }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '170px', objectFit: 'contain', backgroundColor: '#fff' }} />
            <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #f1f1f1' }}>
              <h3 style={{ fontSize: '0.8rem', margin: '5px 0', color: '#333' }}>{item.name}</h3>
              <p style={{ color: '#28a745', fontWeight: 'bold', margin: 0 }}>{item.price} DH</p> {/* ثمن أخضر */}
            </div>
          </div>
        ))}
      </div>

      {/* Modal الوصف */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '25px', width: '100%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px' }}>
              <X size={18} />
            </button>
            <img src={selectedItem.imageUrl} style={{ width: '100%', borderRadius: '15px', maxHeight: '300px', objectFit: 'contain' }} />
            <h2 style={{ fontSize: '1.2rem', margin: '15px 0' }}>{selectedItem.name}</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{selectedItem.description}</p>
            <a href={`https://wa.me/${whatsappNumber}?text=طلب: ${selectedItem.name}`} style={{ display: 'block', background: '#25D366', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', marginTop: '15px' }}>
              اطلب الآن عبر واتساب
            </a>
          </div>
        </div>
      )}
    </div>
  );
}