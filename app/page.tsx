"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Shirt, Smartphone, Footprints, 
  GraduationCap, Search, Moon, Sun, MessageCircle, Star, Camera 
} from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mainImage, setMainImage] = useState("");
  
  // States للتعليقات
  const [reviews, setReviews] = useState<any>({});
  const [newReview, setNewReview] = useState({ user: "", comment: "", stars: 5, photo: null as any });

  const whatsappNumber = "212601042910";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, description, category, sizes, colors,
          "imageUrl": image.asset->url,
          "otherImages": images[].asset->url
        }`);
        setItems(data);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedItem) setMainImage(selectedItem.imageUrl);
  }, [selectedItem]);

  const handleAddReview = (productId: string) => {
    if (!newReview.user || !newReview.comment) return;
    const currentReviews = reviews[productId] || [];
    setReviews({ ...reviews, [productId]: [...currentReviews, { ...newReview, date: new Date().toLocaleDateString() }] });
    setNewReview({ user: "", comment: "", stars: 5, photo: null });
  };

  const filteredItems = items.filter(item => 
    (activeCategory === "الكل" || item?.category === activeCategory) &&
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const theme = {
    bg: isDarkMode ? '#121212' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#000',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    border: isDarkMode ? '#333' : '#eee',
    brand: '#ff4400'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui' }}>
      
      {/* Header (Brayous Brand) */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', backgroundColor: '#000', color: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: theme.brand, fontWeight: '900', margin: 0, fontSize: '1.8rem', letterSpacing: '1px' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <ShoppingCart size={24} />
        </div>
      </header>

      {/* Banner - بحال Temu */}
      <div style={{ background: 'linear-gradient(45deg, #ff4400, #ff8800)', padding: '20px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ margin: 0 }}>تخفيضات رأس السنة 2026</h2>
        <p style={{ margin: '5px 0 0', opacity: 0.9 }}>خصومات تصل إلى 90%</p>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '15px 20px' }}>
        <input type="text" placeholder="ما الذي تبحث عنه في Brayous؟" onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 20px', borderRadius: '30px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', outline: 'none' }} />
      </div>

      {/* Product Grid (2 Items per row) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${theme.border}` }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'cover' }} alt={item.name} />
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '0.85rem', margin: '0 0 5px', height: '34px', overflow: 'hidden' }}>{item.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.brand, fontWeight: 'bold' }}>
                <span>{item.price} DH</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ffaa00', fontSize: '0.7rem' }}>
                   <Star size={12} fill="#ffaa00" /> 4.9
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details & Reviews Modal */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, backgroundColor: theme.card, padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}`, zIndex: 1010 }}>
            <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: theme.text }}><X size={28} /></button>
            <span style={{ fontWeight: 'bold' }}>تفاصيل المنتج</span>
            <div style={{ width: '28px' }}></div>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
             {/* Gallery */}
             <img src={mainImage} style={{ width: '100%', borderRadius: '15px', backgroundColor: '#fff' }} alt="main" />
             <div style={{ display: 'flex', gap: '10px', margin: '15px 0', overflowX: 'auto' }}>
                <img src={selectedItem.imageUrl} onClick={() => setMainImage(selectedItem.imageUrl)} style={{ width: '60px', borderRadius: '8px', border: mainImage === selectedItem.imageUrl ? `2px solid ${theme.brand}` : '1px solid #ddd' }} alt="thumb" />
                {selectedItem.otherImages?.map((img: string, i: number) => (
                  <img key={i} src={img} onClick={() => setMainImage(img)} style={{ width: '60px', borderRadius: '8px', border: mainImage === img ? `2px solid ${theme.brand}` : '1px solid #ddd' }} alt="thumb" />
                ))}
             </div>

             <h1 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{selectedItem.name}</h1>
             <p style={{ color: theme.brand, fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedItem.price} DH</p>

             {/* Review Section (التعليقات والتقييم) */}
             <div style={{ marginTop: '40px', borderTop: `1px solid ${theme.border}`, paddingTop: '20px' }}>
                <h3 style={{ marginBottom: '20px' }}>تعليقات الزبناء وتقييماتهم</h3>
                
                {/* Add Review Form */}
                <div style={{ backgroundColor: theme.card, padding: '15px', borderRadius: '12px', marginBottom: '20px', border: `1px solid ${theme.border}` }}>
                  <input type="text" placeholder="اسمك..." value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <textarea placeholder="اكتب رأيك في المنتج..." value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}></textarea>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= newReview.stars ? "#ffaa00" : "none"} color="#ffaa00" onClick={() => setNewReview({...newReview, stars: s})} style={{cursor:'pointer'}} />)}
                    </div>
                    <button onClick={() => handleAddReview(selectedItem._id)} style={{ backgroundColor: '#000', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>نشر التعليق</button>
                  </div>
                </div>

                {/* Display Reviews */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {(reviews[selectedItem._id] || []).map((rev: any, i: number) => (
                    <div key={i} style={{ padding: '15px', borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <strong>{rev.user}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{rev.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.stars ? "#ffaa00" : "none"} color="#ffaa00" />)}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem' }}>{rev.comment}</p>
                    </div>
                  ))}
                  {!(reviews[selectedItem._id]?.length) && <p style={{ color: '#999', textAlign: 'center' }}>لا توجد تعليقات بعد. كن أول من يقيم هذا المنتج!</p>}
                </div>
             </div>

             <a href={`https://wa.me/${whatsappNumber}?text=طلب من Brayous: ${selectedItem.name}`} style={{ display: 'block', backgroundColor: '#25D366', color: '#fff', textAlign: 'center', padding: '18px', borderRadius: '15px', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', marginTop: '30px', position: 'sticky', bottom: '20px' }}>
              أطلب الآن عبر واتساب
             </a>
          </div>
        </div>
      )}
    </div>
  );
}