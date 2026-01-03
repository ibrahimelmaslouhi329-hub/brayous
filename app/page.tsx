"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Shirt, Smartphone, Footprints, 
  GraduationCap, Search, Moon, Sun, MessageCircle, Star 
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
  
  const [reviews, setReviews] = useState<any>({});
  const [newReview, setNewReview] = useState({ user: "", comment: "", stars: 5 });

  const whatsappNumber = "212601042910";

  const categories = [
    { name: "الكل", icon: <Search size={20} />, color: "#333" },
    { name: "جاكيط", icon: <Shirt size={22} />, color: "#ff0000" },
    { name: "سراول", icon: <Smartphone size={22} style={{transform: 'rotate(180deg)'}}/>, color: "#007bff" },
    { name: "كاسكيطات", icon: <GraduationCap size={22} />, color: "#28a745" },
    { name: "سبرديلات", icon: <Footprints size={22} />, color: "#ffc107" } 
  ];

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
    setNewReview({ user: "", comment: "", stars: 5 });
  };

  const filteredItems = items.filter(item => 
    (activeCategory === "الكل" || item?.category === activeCategory) &&
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#000',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    border: isDarkMode ? '#333' : '#eee',
    secondaryText: isDarkMode ? '#aaa' : '#666',
    blueBar: '#0055ff'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.6rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text }}>
            {isDarkMode ? <Sun size={22} color="#ffc107" /> : <Moon size={22} />}
          </button>
          <ShoppingCart size={24} />
        </div>
      </header>

      {/* الشريط الأزرق الكبير */}
      <div style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '25px 10px', textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', textTransform: 'uppercase', boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.1)' }}>
        BRAYOUS_SHOP
      </div>

      {/* Search */}
      <div style={{ padding: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }} size={18} color="#999" />
          <input type="text" placeholder="قلب على الموديل..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '15px 45px 15px 15px', borderRadius: '30px', border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`, backgroundColor: theme.card, color: theme.text, outline: 'none' }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 20px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '75px' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '18px', backgroundColor: activeCategory === cat.name ? cat.color : theme.card, color: activeCategory === cat.name ? '#fff' : cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${cat.color}`, transition: '0.3s' }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.75rem', marginTop: '6px', fontWeight: 'bold' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '15px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            <div style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px' }}>
                <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '5px', height: '32px', overflow: 'hidden' }}>{item.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ff4400', fontWeight: 'bold' }}>{item.price} DH</span>
                <Star size={10} fill="#ffaa00" color="#ffaa00" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, backgroundColor: theme.card, padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, zIndex: 1010 }}>
             <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: theme.text }}><X size={28} /></button>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>تفاصيل المنتج</h2>
            <div style={{ width: '28px' }}></div>
          </div>

          <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* 1. الصور أولاً */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${theme.border}`, marginBottom: '15px' }}>
              <img src={mainImage} style={{ width: '100%', maxHeight: '450px', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
              <img src={selectedItem.imageUrl} onClick={() => setMainImage(selectedItem.imageUrl)} style={{ width: '65px', height: '65px', borderRadius: '8px', border: mainImage === selectedItem.imageUrl ? '2px solid #ff4400' : '1px solid #ddd', cursor: 'pointer', objectFit: 'cover' }} />
              {selectedItem.otherImages?.map((img: string, i: number) => (
                <img key={i} src={img} onClick={() => setMainImage(img)} style={{ width: '65px', height: '65px', borderRadius: '8px', border: mainImage === img ? '2px solid #ff4400' : '1px solid #ddd', cursor: 'pointer', objectFit: 'cover' }} />
              ))}
            </div>

            {/* 2. آراء الزبناء مباشرة تحت الصور */}
            <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}`, marginBottom: '25px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold', color: theme.blueBar }}>آراء الزبناء والتقييمات</h3>
              <input type="text" placeholder="اسمك الكامل..." value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }} />
              <textarea placeholder="ما هو رأيك في هذا المنتج؟" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', minHeight: '80px' }}></textarea>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={24} fill={s <= newReview.stars ? "#ffaa00" : "none"} color="#ffaa00" onClick={() => setNewReview({...newReview, stars: s})} style={{cursor:'pointer'}} />)}
                </div>
                <button onClick={() => handleAddReview(selectedItem._id)} style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>إرسال التقييم</button>
              </div>

              <div style={{ marginTop: '25px' }}>
                {(reviews[selectedItem._id] || []).map((rev: any, i: number) => (
                  <div key={i} style={{ padding: '15px 0', borderBottom: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{rev.user}</strong>
                      <div style={{ display: 'flex' }}>{[...Array(rev.stars)].map((_, j) => <Star key={j} size={12} fill="#ffaa00" color="#ffaa00" />)}</div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: theme.secondaryText, marginTop: '8px' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. الوصف والمعلومات */}
            <div style={{ textAlign: 'right', marginBottom: '100px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '10px' }}>{selectedItem.name}</h1>
              <p style={{ fontSize: '2rem', color: '#ff4400', fontWeight: 'bold', marginBottom: '15px' }}>{selectedItem.price} DH</p>
              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '15px' }}>
                <h4 style={{ marginBottom: '10px' }}>وصف المنتج:</h4>
                {selectedItem.description?.split('\n').map((line: string, i: number) => (
                  <p key={i} style={{ fontSize: '1rem', color: theme.secondaryText, marginBottom: '8px' }}>• {line}</p>
                ))}
              </div>
            </div>

            {/* زر الواتساب الثابت */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '15px', backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, zIndex: 1100 }}>
              <a href={`https://wa.me/${whatsappNumber}?text=طلب منتج: ${selectedItem.name}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#25D366', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.2rem' }}>
                <MessageCircle size={24} /> أطلب الآن عبر واتساب
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}