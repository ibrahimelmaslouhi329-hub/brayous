"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
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

  const categories = ["الكل", "ملابس رجال", "سراول", "كاسكيطات", "سبرديلات"];
  const whatsappNumber = "212601042910"; 

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
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', alignItems: 'center', borderBottom: '1px solid #eee', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 50 }}>
        <h1 style={{ color: '#ff0000', fontWeight: 'bold', margin: 0 }}>BRAYOUS</h1>
        <ShoppingCart size={24} />
      </header>

      {/* Categories Bar */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 15px', backgroundColor: '#f9f9f9' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: '8px 15px', borderRadius: '20px', border: activeCategory === cat ? 'none' : '1px solid #ddd',
              backgroundColor: activeCategory === cat ? '#ff0000' : '#fff',
              color: activeCategory === cat ? '#fff' : '#333',
              whiteSpace: 'nowrap', cursor: 'pointer'
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '15px' }}>
        <input type="text" placeholder="ابحث عن منتج..." onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '25px', border: '1px solid #ff0000', outline: 'none' }} />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#fff' }}>
            {/* objectFit: 'contain' باش الصورة تبان كاملة */}
            <img src={item.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'contain', backgroundColor: '#f4f4f4' }} />
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.8rem', margin: '5px 0' }}>{item.name}</h3>
              <p style={{ color: '#ff0000', fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal الوصف */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', width: '100%', maxWidth: '450px', position: 'relative' }}>
            {/* زر الخروج X */}
            <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '-15px', left: '-15px', backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
            
            <img src={selectedItem.imageUrl} style={{ width: '100%', borderRadius: '10px', maxHeight: '300px', objectFit: 'contain' }} />
            <h2 style={{ fontSize: '1.2rem', margin: '15px 0' }}>{selectedItem.name}</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{selectedItem.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <span style={{ fontSize: '1.4rem', color: '#ff0000', fontWeight: 'bold' }}>{selectedItem.price} DH</span>
              <a href={`https://wa.me/${whatsappNumber}?text=طلب: ${selectedItem.name}`} style={{ background: '#25D366', color: '#fff', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>طلب واتساب</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}