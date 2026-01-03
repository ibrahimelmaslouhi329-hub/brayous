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
      
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.card, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.6rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text }}>
            {isDarkMode ? <Sun size={22} color="#ffc107" /> : <Moon size={22} />}
          </button>
          <ShoppingCart size={24} />
        </div>
      </header>

      <div style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '20px 10px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem' }}>
        BRAYOUS_SHOP
      </div>

      <div style={{ padding: '15px 20px' }}>
        <input type="text" placeholder="قلب هنا..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 20px', borderRadius: '30px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, outline: 'none' }} />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 20px', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '70px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', backgroundColor: activeCategory === cat.name ? cat.color : theme.card, color: activeCategory === cat.name ? '#fff' : cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${cat.color}` }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.7rem', marginTop: '5px' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <div style={{ backgroundColor: '#fff', height: '160px' }}>
              <img src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '8px' }}>
              <h3 style={{ fontSize: '0.75rem', height: '30px', overflow: 'hidden' }}>{item.name}</h3>
              <p style={{ color: '#ff4400', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, backgroundColor: theme.card, padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}`, zIndex: 1010 }}>
            <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: theme.text }}><X size={28} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{ width: '28px' }}></div>
          </div>

          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '15px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              
              {/* جهة اليمين: الصور والتعليقات تحتها مصغرة */}
              <div style={{ flex: '1 1 350px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
                  <img src={mainImage} style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto' }}>
                  <img src={selectedItem.imageUrl} onClick={() => setMainImage(selectedItem.imageUrl)} style={{ width: '55px', height: '55px', borderRadius: '6px', border: mainImage === selectedItem.imageUrl ? '2px solid #ff4400' : '1px solid #ddd', cursor: 'pointer' }} />
                  {selectedItem.otherImages?.map((img: string, i: number) => (
                    <img key={i} src={img} onClick={() => setMainImage(img)} style={{ width: '55px', height: '55px', borderRadius: '6px', border: mainImage === img ? '2px solid #ff4400' : '1px solid #ddd', cursor: 'pointer' }} />
                  ))}
                </div>

                {/* قسم التعليقات (مصغر تحت الصور) */}
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: theme.card, borderRadius: '10px', border: `1px solid ${theme.border}` }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '10px' }}>التقييمات</h4>
                  <input type="text" placeholder="الاسم" value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} style={{ width: '100%', padding: '8px', fontSize: '0.8rem', marginBottom: '8px', borderRadius: '5px', border: '1px solid #ddd' }} />
                  <textarea placeholder="رأيك..." value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} style={{ width: '100%', padding: '8px', fontSize: '0.8rem', borderRadius: '5px', border: '1px solid #ddd', minHeight: '50px' }}></textarea>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <div style={{ display: 'flex' }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= newReview.stars ? "#ffaa00" : "none"} color="#ffaa00" onClick={() => setNewReview({...newReview, stars: s})} style={{cursor:'pointer'}} />)}
                    </div>
                    <button onClick={() => handleAddReview(selectedItem._id)} style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '5px 12px', fontSize: '0.8rem', borderRadius: '5px', border: 'none' }}>إرسال</button>
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    {(reviews[selectedItem._id] || []).map((rev: any, i: number) => (
                      <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${theme.border}`, fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{rev.user}</strong> <Star size={8} fill="#ffaa00" color="#ffaa00" /></div>
                        <p style={{ color: theme.secondaryText }}>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* جهة اليسار: الوصف والألوان والمقاسات */}
              <div style={{ flex: '1 1 300px' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{selectedItem.name}</h1>
                <p style={{ fontSize: '1.8rem', color: '#ff4400', fontWeight: 'bold', margin: '10px 0' }}>{selectedItem.price} DH</p>
                
                {/* المقاسات - تظهر فقط إذا وجدت في Sanity */}
                {selectedItem.sizes && (
                  <div style={{ marginBottom: '15px' }}>
                    <h5 style={{ marginBottom: '5px', fontSize: '0.9rem' }}>المقاسات المتوفرة:</h5>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {selectedItem.sizes.split(',').map((s: string) => <span key={s} style={{ padding: '4px 10px', border: `1px solid ${theme.border}`, borderRadius: '4px', fontSize: '0.8rem' }}>{s.trim()}</span>)}
                    </div>
                  </div>
                )}

                {/* الألوان - تظهر فقط إذا وجدت */}
                {selectedItem.colors && (
                  <div style={{ marginBottom: '15px' }}>
                    <h5 style={{ marginBottom: '5px', fontSize: '0.9rem' }}>الألوان:</h5>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {selectedItem.colors.split(',').map((c: string) => <span key={c} style={{ padding: '4px 10px', border: `1px solid ${theme.border}`, borderRadius: '4px', fontSize: '0.8rem' }}>{c.trim()}</span>)}
                    </div>
                  </div>
                )}

                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '10px' }}>
                  <h5 style={{ marginBottom: '8px' }}>الوصف:</h5>
                  <p style={{ fontSize: '0.9rem', color: theme.secondaryText, whiteSpace: 'pre-line' }}>{selectedItem.description}</p>
                </div>

                {/* زر الطلب */}
                <a href={`https://wa.me/${whatsappNumber}?text=طلب: ${selectedItem.name}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#25D366', color: '#fff', padding: '15px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', marginTop: '20px', fontSize: '1.1rem' }}>
                  طلب
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}