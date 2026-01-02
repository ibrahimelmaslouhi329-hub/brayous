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
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      
      {/* HEADER: اللوغو باللون الأحمر والخط المستيلي */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 5%', backgroundColor: '#fff', borderBottom: '2px solid #ff0000',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ 
          fontSize: '32px', fontWeight: '900', color: '#ff0000', 
          letterSpacing: '3px', textTransform: 'uppercase', fontStyle: 'italic'
        }}>
          BRAYOUS
        </div>
        <div style={{ position: 'relative', cursor: 'pointer', color: '#ff0000' }}>
          <span style={{ fontSize: '28px' }}>🛒</span>
        </div>
      </nav>

      <div style={{ padding: '30px 5%' }}>
        {/* خانة البحث حمراء */}
        <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
          <input 
            type="text" 
            placeholder="🔍 قلب على الموديلات الجديدة..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '15px 25px', borderRadius: '50px', 
              border: '2px solid #ff0000', outline: 'none', fontSize: '16px',
              color: '#333', fontWeight: '500'
            }} 
          />
        </div>

        {/* عرض السلعة */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '35px' }}>
          {filteredProducts.map((product: any) => (
            <div key={product.name} style={{ 
              backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', 
              boxShadow: '0 10px 20px rgba(255,0,0,0.05)', border: '1px solid #eee'
            }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '380px', objectFit: 'cover' }} />
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '10px 0', color: '#ff0000', fontWeight: '700', fontSize: '1.3rem' }}>{product.name}</h3>
                <p style={{ color: '#000', fontWeight: '900', fontSize: '1.5rem', marginBottom: '20px' }}>{product.price} DH</p>
                
                <a 
                  href={`https://wa.me/212600000000?text=بغيت_نطلب_${product.name}`} 
                  style={{ 
                    display: 'block', backgroundColor: '#ff0000', color: '#fff', 
                    padding: '12px', borderRadius: '30px', textDecoration: 'none', 
                    fontWeight: 'bold', fontSize: '16px', letterSpacing: '1px',
                    boxShadow: '0 4px 10px rgba(255,0,0,0.3)'
                  }}
                >
                  طلب الآن عبر واتساب
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}