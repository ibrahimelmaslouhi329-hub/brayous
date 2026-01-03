"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { client } from '@/js/sanity'; // تأكد من أن مسار الكلاينت صحيح عندك

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // --- حط نمرتك هنا ---
  const myNumber = "212601042010"; 

  useEffect(() => {
    // كود جلب البيانات من Sanity
    const fetchProducts = async () => {
      const data = await client.fetch(`*[_type == "servite_brayous_shop"]{
        name,
        price,
        "imageUrl": image.asset->url,
        description,
        "additionalImages": additionalImages[].asset->url
      }`);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: 'sans-serif' }}>
      
      {/* Header: اللوغو والسلة */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', borderBottom: '1px solid #eee', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', fontSize: '1.8rem', margin: 0, letterSpacing: '-1px' }}>BRAYOUS</h1>
        <div style={{ position: 'relative' }}>
          <ShoppingCart size={28} color="#333" />
          <span style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#ff0000', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>0</span>
        </div>
      </header>

      {/* Search Bar */}
      <div style={{ padding: '20px' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="قلب على الموديلات الجديدة..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '15px 45px 15px 15px', borderRadius: '30px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
          />
          <Search style={{ position: 'absolute', right: '15px', top: '15px', color: '#999' }} size={20} />
        </div>
      </div>

      {/* Grid: جوج منتجات حدا بعضياتهم */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', padding: '0 15px 30px' }}>
        {filteredProducts.map((product) => (
          <div key={product.name} 
               onClick={() => setSelectedProduct(product)}
               style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f9f9f9' }}>
            
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            
            <div style={{ padding: '12px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.9rem', margin: '5px 0', color: '#444', height: '35px', overflow: 'hidden' }}>{product.name}</h3>
              <p style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '1.2rem', margin: '8px 0' }}>{product.price} DH</p>
              
              <a href={`https://wa.me/${myNumber}?text=بغيت نطلب: ${product.name}`}
                 onClick={(e) => e.stopPropagation()}
                 style={{ display: 'block', backgroundColor: '#ff0000', color: '#fff', padding: '10px', borderRadius: '12px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>
                طلب عبر واتساب
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: تفاصيل المنتج (الوصف والصور الإضافية) */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '25px', padding: '20px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f0f0f0', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', zIndex: 2 }}>✕</button>
            
            <img src={selectedProduct.imageUrl} style={{ width: '100%', borderRadius: '15px', marginBottom: '15px' }} />
            
            {/* عرض صور أخرى */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
              {selectedProduct.additionalImages?.map((img: string, i: number) => (
                <img key={i} src={img} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #eee' }} />
              ))}
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#222', marginBottom: '10px' }}>{selectedProduct.name}</h2>
            <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>{selectedProduct.description || "هذا الموديل من أحدث صيحات BRAYOUS، جودة عالية وتصميم مريح."}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <span style={{ fontSize: '1.5rem', color: '#ff0000', fontWeight: 'bold' }}>{selectedProduct.price} DH</span>
                <a href={`https://wa.me/${myNumber}?text=تأكيد طلب: ${selectedProduct.name}`} 
                   style={{ backgroundColor: '#25D366', color: '#fff', padding: '12px 25px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem' }}>
                  تأكيد عبر واتساب
                </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}