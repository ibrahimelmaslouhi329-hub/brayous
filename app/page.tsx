"use client";
import { useState, useEffect } from "react";
import { createClient } from "next-sanity";

// إعدادات الربط مع Sanity
const client = createClient({
  projectId: "t6a3pwpc",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default function IndexPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // جلب السلعة من Sanity
  useEffect(() => {
    client.fetch(`*[_type == "product"]{
      name,
      price,
      "imageUrl": image.asset->url
    }`).then(data => setProducts(data));
  }, []);

  // تصفية السلعة على حساب شنو كتب الكليان في البحث
  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ألوان الوضع الليلي والعادي
  const theme = {
    bg: darkMode ? "#121212" : "#f4f4f4",
    card: darkMode ? "#1e1e1e" : "#ffffff",
    text: darkMode ? "#ffffff" : "#1a1a1a",
    input: darkMode ? "#2d2d2d" : "#ffffff",
    accent: "#e44d26"
  };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, transition: '0.3s', fontFamily: 'sans-serif' }}>
      
      {/* HEADER: اللوغو، السلة، والوضع الليلي */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px 5%', backgroundColor: theme.card, boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px' }}>BRAYOUS</div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px' }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: '26px' }}>🛒</span>
            <span style={{ position: 'absolute', top: '-5px', right: '-10px', backgroundColor: theme.accent, color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>0</span>
          </div>
        </div>
      </nav>

      <div style={{ padding: '30px 5%' }}>
        {/* خانة البحث الاحترافية */}
        <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
          <input 
            type="text" 
            placeholder="قلب على اللبسة اللي بغيتي (مثلاً: تيشيرت، سروال...)" 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '15px 25px', borderRadius: '30px', 
              border: 'none', backgroundColor: theme.input, color: theme.text,
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)', outline: 'none', fontSize: '16px'
            }} 
          />
        </div>

        {/* عرض المنتجات */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredProducts.map((product: any) => (
            <div key={product.name} style={{ 
              backgroundColor: theme.card, borderRadius: '20px', overflow: 'hidden', 
              boxShadow: '0 5px 15px rgba(0,0,0,0.08)', transition: 'transform 0.2s' 
            }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '10px 0', fontSize: '1.2rem' }}>{product.name}</h3>
                <p style={{ color: theme.accent, fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '15px' }}>{product.price} DH</p>
                
                {/* زر الواتساب مع رسالة أوتوماتيكية */}
                <a 
                  href={`https://wa.me/212600000000?text=السلام_عليكم،_بغيت_نطلب_هاد_اللبسة:_${product.name}`} 
                  target="_blank"
                  style={{ 
                    display: 'block', backgroundColor: '#25D366', color: '#fff', 
                    padding: '12px', borderRadius: '12px', textDecoration: 'none', 
                    fontWeight: 'bold', fontSize: '16px'
                  }}
                >
                  طلب عبر واتساب ✅
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* رسالة في حالة مالقاش الكليان داكشي اللي كيقلب عليه */}
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px', opacity: 0.6 }}>
            <p>مالقينا حتى لبسة بهاد السمية، جربي كلمة أخرى! 🧐</p>
          </div>
        )}
      </div>
    </div>