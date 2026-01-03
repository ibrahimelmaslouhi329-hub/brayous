"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Shirt, Smartphone, HardDrive, Footprints, GraduationCap, Search } from 'lucide-react';
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

  const categories = [
    { name: "الكل", icon: <Search size={20} />, color: "#333" },
    { name: "ملابس رجال", icon: <Shirt size={20} />, color: "#ff0000" }, // أحمر
    { name: "سراول", icon: <Smartphone size={20} style={{transform: 'rotate(180deg)'}}/>, color: "#007bff" }, // أزرق
    { name: "كاسكيطات", icon: <GraduationCap size={20} />, color: "#28a745" }, // أخضر
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

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', alignItems: 'center', borderBottom: '3px solid #ff0000', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
        <h1 style={{ color: '#ff0000', fontWeight: 'bold', margin: 0, fontSize: '1.5rem' }}>BRAYOUS</h1>
        <ShoppingCart size={24} color="#007bff" />
      </header>

      {/* Categories Icons */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '15px', backgroundColor: '#f8f9fa' }}>
        {categories.map(cat => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '70px' }}>
            <div style={{ 
              width: '55px', height: '55px', borderRadius: '18px', 
              backgroundColor: activeCategory === cat.name ? cat.color : '#fff',
              color: activeCategory === cat.name ? '#fff' : cat.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${cat.color}`, transition: '0.3s'
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.75rem', marginTop: '5px', fontWeight: 'bold' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid #eee', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#f4f4f4', height: '180px', display: 'flex', alignItems: 'center' }}>
                <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '12px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.85rem', margin: '5px 0', color: '#333' }}>{item.name}</h3>
              <p style={{ color: '#ff0000', fontWeight: 'bold', margin: 0, fontSize: '1.1rem' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal الوصف مع علامة X واضحة */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '25px', width: '100%', maxWidth: '450px', position: 'relative' }}>
            {/* زر الخروج */}
            <button 
                onClick={() => setSelectedItem(null)} 
                style={{ position: 'absolute', top: '-15px', right: '-15px', backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
            >
              <X size={24} />
            </button>

            <img src={selectedItem.imageUrl} style={{ width: '100%', borderRadius: '15px', maxHeight: '350px', objectFit: 'contain' }} />
            <h2 style={{ fontSize: '1.4rem', margin: '15px 0', textAlign: 'right' }}>{selectedItem.name}</h2>
            <p style={{ color: '#666', fontSize: '1rem', textAlign: 'right', lineHeight: '1.4' }}>{selectedItem.description}</p>
            
            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <a href={`https://wa.me/${whatsappNumber}?text=طلب: ${selectedItem.name}`} style={{ display: 'block', background: '#25D366', color: '#fff', textAlign: 'center', padding: '15px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                تأكيد الطلب (واتساب)
                </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}