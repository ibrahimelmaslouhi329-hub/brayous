"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { createClient } from 'next-sanity';

// معلوماتك الحقيقية من الصور 45 و 46
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

  // نمرتك الجديدة
  const whatsappNumber = "212601042910"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          name, price, "imageUrl": image.asset->url, description
        }`);
        setItems(data);
      } catch (error) {
        console.error("Error:", error);
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
        <h1 style={{ color: '#ff0000', fontWeight: 'bold', margin: 0 }}>BRAYOUS</h1>
        <ShoppingCart size={24} />
      </header>

      <div style={{ padding: '15px' }}>
        <input 
          type="text" 
          placeholder="ابحث هنا..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '20px', border: '1px solid #ff0000', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '160px', objectFit: 'cover' }} alt={item.name} />
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.8rem', margin: '5px 0' }}>{item.name}</h3>
              <p style={{ color: '#ff0000', fontWeight: 'bold', margin: 0 }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', width: '100%', maxWidth: '400px', textAlign: 'right' }}>
            <button onClick={() => setSelectedItem(null)} style={{ float: 'left' }}>إغلاق</button>
            <img src={selectedItem.imageUrl} style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }} alt={selectedItem.name} />
            <h2 style={{ fontSize: '1.2rem', margin: '15px 0' }}>{selectedItem.name}</h2>
            <p style={{ color: '#666' }}>{selectedItem.description}</p>
            <p style={{ fontSize: '1.3rem', color: '#ff0000', fontWeight: 'bold' }}>{selectedItem.price} DH</p>
            <a href={`https://wa.me/${whatsappNumber}?text=طلب: ${selectedItem.name}`} style={{ display: 'block', background: '#25D366', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>طلب واتساب</a>
          </div>
        </div>
      )}
    </div>
  );
}