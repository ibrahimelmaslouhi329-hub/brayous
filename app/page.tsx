"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { createClient } from 'next-sanity';

// إعدادات Sanity بالكود ديالك الحقيقي
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

  // رقم الواتساب الجديد ديالك
  const whatsappNumber = "212601042910"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          name,
          price,
          "imageUrl": image.asset->url,
          description,
          "otherImages": additionalImages[].asset->url
        }`);
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(item => 
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', borderBottom: '2px solid #f5f5f5', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', fontSize: '1.7rem', margin: 0 }}>BRAYOUS</h1>
        <ShoppingCart size={26} color="#333" />
      </header>

      {/* Search Bar */}
      <div style={{ padding: '15px' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="ابحث عن موديلات Brayous..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 15px', borderRadius: '30px', border: '1px solid #ff0000', outline: 'none' }}
          />
        </div>
      </div>

      {/* Product Grid - 2 per row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '10px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} 
               onClick={() => setSelectedItem(item)}
               style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #eee', cursor: 'pointer' }}>
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.85rem', margin: '5px 0', height: '34px', overflow: 'hidden' }}>{item.name}</h3>
              <p style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '1.1rem', margin: '5px 0' }}>{item.price} DH</p>
              <button style={{ width: '100%', backgroundColor: '#ff0000', color: '#fff', border: 'none', padding: '8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                عرض التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Details & Order */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '25px', padding: '20px', position: 'relative', maxHeight: '