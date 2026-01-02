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
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px 5%', backgroundColor: '#fff', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0 }}>BRAYOUS</h1>
      </nav>

      <div style={{ padding: '20px 5%' }}>
        <input 
          type="text" 
          placeholder="🔍 قلب على السلعة..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '500px', display: 'block', margin: '0 auto 30px auto', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} 
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {filteredProducts.map((product: any) => (
            <div key={product.name} style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', paddingBottom: '15px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              <h3>{product.name}</h3>
              <p style={{ color: '#e44d26', fontWeight: 'bold' }}>{product.price} DH</p>
              <a href={`https://wa.me/212600000000?text=بغيت_نطلب_${product.name}`} style={{ backgroundColor: '#25D366', color: '#fff', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>واتساب ✅</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}