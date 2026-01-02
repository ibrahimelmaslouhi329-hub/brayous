"use client";
import { useState, useEffect } from "react";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "t6a3pwpc",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default function IndexPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    client.fetch(`*[_type == "product"]{
      name,
      price,
      "imageUrl": image.asset->url
    }`).then(data => setProducts(data));
  }, []);

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER: اللوغو والسلة */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px 5%', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>BRAYOUS</div>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: '26px' }}>🛒</span>
          <span style={{ position: 'absolute', top: '-5px', right: '-10px', backgroundColor: '#e44d26', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>0</span>
        </div>
      </nav>

      <div style={{ padding: '20px 5%' }}>
        {/* خانة البحث */}
        <div style={{ maxWidth: '600px', margin: '0 auto 30px auto' }}>
          <input 
            type="text" 
            placeholder="🔍 قلب على اللبسة اللي بغيتي..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '15px', borderRadius: '25px', 
              border: '1px solid #ddd', outline: 'none', fontSize: '16px'
            }} 
          />
        </div>

        {/* عرض السلعة بالصور والواتساب */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredProducts.map((product: any) => (
            <div key={product.name} style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
              <div style={{ padding: '15px', textAlign: 'center' }}>
                <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
                <p style={{ color: '#e44d26', fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price} DH</p>
                <a 
                  href={`https://wa.me/212600000000?text=بغيت_نطلب_${product.name}`} 
                  style={{ 
                    display: 'block', backgroundColor: '#25D366', color: '#fff', 
                    padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', marginTop: '10px'
                  }}
                >
                  طلب عبر واتساب ✅
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}