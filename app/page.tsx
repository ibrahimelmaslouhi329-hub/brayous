"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { createClient } from 'next-sanity';

// إعدادات Sanity - تأكد بلي هاد المعلومات صحيحة عندك
const client = createClient({
  projectId: "حط_هنا_Project_ID_ديالك", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const whatsappNumber = "212601042010"; // حط نمرتك هنا

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
        console.error("خطأ في جلب البيانات:", error);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(item => 
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', direction: 'rtl' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', alignItems: 'center', borderBottom: '1px solid #eee' }}>
        <h1 style={{ color: '#ff0000', fontWeight: 'bold' }}>BRAYOUS</h1>
        <ShoppingCart size={24} />
      </header>

      <div style={{ padding: '15px' }}>
        <input 
          type="text" 
          placeholder="ابحث عن الملابس..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '20px', border: '1px solid #ff0000' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.9rem' }}>{item.name}</h3>
              <p style={{ color: '#ff0000', fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, padding: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '20