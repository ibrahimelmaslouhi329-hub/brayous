"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Search, Moon, Sun, Trash2, Star, Truck 
} from 'lucide-react';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: "t6a3pwpc", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const categories = [
  { name: "الكل", icon: "🛍️" },
  { name: "جاكيط", icon: "🧥" },
  { name: "سروال", icon: "👖" },
  { name: "قبية", icon: "👕" },
  { name: "طرابش", icon: "🧢" },
  { name: "سيرڤيت", icon: "🏃" },
];

export const dynamic = 'force-dynamic';
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mainImage, setMainImage] = useState("");
  
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: "", city: "", address: "" });
  
  const [reviews, setReviews] = useState<any>({});
  const [newReview, setNewReview] = useState({ user: "", comment: "", stars: 5 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, oldPrice, description, category,
          "imageUrl": image.asset->url,
          "otherImages": images[].asset->url
        }`);
        setItems(data);
      } catch (error) { console.error("Error fetching data:", error); }
    };
    fetchData();
  }, []);

  useEffect(() => { if (selectedItem) setMainImage(selectedItem.imageUrl); }, [selectedItem]);

  const handleAddReview = (productId: string) => {
    if (!newReview.user || !newReview.comment) return;
    const currentReviews = reviews[productId] || [];
    setReviews({ ...reviews, [productId]: [{ ...newReview, date: new Date().toLocaleDateString() }, ...currentReviews] });
    setNewReview({ user: "", comment: "", stars: 5 });
  };

  const addToCart = (product: any) => {
    setCart([...cart, { ...product }]);
    setSelectedItem(null);
    setIsCartOpen(true);
  };

  // تعريف الألوان باش ما يوقعش خطأ SecondaryText
  const theme = {
    bg: isDarkMode ? '#0a0a0a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    card: isDarkMode ? '#1a1a1a' : '#f9f9f9',
    redBrand: '#ff0000',
    secondaryText: isDarkMode ? '#888' : '#777'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header مع إصلاح قوس الزر */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', backgroundColor: theme.bg, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: theme.redBrand, fontWeight: '900', margin: 0, fontSize: '1.6rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
           <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer' }}>
             {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
           </button>
           <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: theme.redBrand, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '50%' }}>{cart.length}</span>}
           </div>
        </div>
      </header>

      <div style={{ backgroundColor: theme.redBrand, color: '#fff', padding: '20px 10px', textAlign: 'center', fontWeight: '900', fontSize: '1.8rem' }}>
        BRAYOUS_SHOP
      </div>

      <div style={{ padding: '15px 20px' }}>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <input type="text" placeholder="بحث..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', borderRadius: '30px', border: '1px solid #eee', backgroundColor: theme.card, color: theme.text, outline: 'none' }} />
          <Search size={18} style={{ position: 'absolute', right: '15px', top: '13px', color: '#999' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '0 20px 20px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ textAlign: 'center', cursor: 'pointer', minWidth: '60px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: activeCategory === cat.name ? theme.redBrand : theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{cat.icon}</div>
            <span style={{ fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px' }}>
        {items.filter(i => (activeCategory === "الكل" || i.category === activeCategory) && i.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: '160px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={item.imageUrl} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '0.8rem', height: '32px', overflow: 'hidden', margin: '0' }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                <span style={{ color: theme.redBrand, fontWeight: 'bold' }}>{item.price} DH</span>
                {item.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.7rem' }}>{item.oldPrice} DH</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: theme.bg, zIndex: 11 }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{width: 28}}></div>
          </div>

          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '15px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
              <div style={{ flex: '1 1 400px' }}>
                <img src={mainImage} alt="" style={{ width: '100%', borderRadius: '15px', backgroundColor: '#fff' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {[selectedItem.imageUrl, ...(selectedItem.otherImages || [])].map((img, idx) => (
                    <img key={idx} src={img} alt="" onClick={() => setMainImage(img)} style={{ width: '60px', height: '60px', borderRadius: '8px', border: mainImage === img ? `2px solid ${theme.redBrand}` : '1px solid #ddd', cursor: 'pointer', objectFit: 'contain' }} />
                  ))}
                </div>
              </div>

              <div style={{ flex: '1 1 350px' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedItem.name}</h2>
                <div style={{ display: 'flex', gap: '15px', margin: '15px 0', alignItems: 'center' }}>
                  <span style={{ color: theme.redBrand, fontSize: '2rem', fontWeight: '900' }}>{selectedItem.price} DH</span>
                  {selectedItem.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through' }}>{selectedItem.oldPrice} DH</span>}
                </div>
                <p style={{ fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-line', color: theme.text }}>{selectedItem.description}</p>
                <button onClick={() => addToCart(selectedItem)} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '20px', cursor: 'pointer' }}>إضافة إلى السلة 🛒</button>
                
                {/* قسم التقييمات البسيط */}
                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <h4 style={{ marginBottom: '15px' }}>آراء الزبناء ⭐</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(reviews[selectedItem._id] || []).map((rev: any, i: number) => (
                      <div key={i} style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{rev.user}</span>
                          <div style={{ display: 'flex' }}>{[...Array(rev.stars)].map((_, s) => <Star key={s} size={10} fill="#ffcc00" color="#ffcc00" />)}</div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: theme.secondaryText, margin: '2px 0 0' }}>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" placeholder="سميتك" value={newReview.user} onChange={(e)=>setNewReview({...newReview, user:e.target.value})} style={{padding:'8px', borderRadius:'5px', border:'1px solid #ddd', backgroundColor: theme.card, color: theme.text}} />
                    <textarea placeholder="تعليقك" value={newReview.comment} onChange={(e)=>setNewReview({...newReview, comment:e.target.value})} style={{padding:'8px', borderRadius:'5px', border:'1px solid #ddd', backgroundColor: theme.card, color: theme.text}} />
                    <button onClick={() => handleAddReview(selectedItem._id)} style={{ backgroundColor: '#000', color: '#fff', padding: '8px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>نشر</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال السلة والشحن */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1500 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color: theme.text}}><X size={30} /></button>
            <strong>السلة ({cart.length})</strong>
            <div style={{width: 30}}></div>
          </div>
          <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                <div><h4 style={{margin:0}}>{item.name}</h4><p style={{margin:0, color: theme.redBrand}}>{item.price} DH</p></div>
                <button onClick={() => {const n=[...cart]; n.splice(i,1); setCart(n);}} style={{color:'red', border:'none', background:'none'}}><Trash2 size={20}/></button>
              </div>
            ))}
{/* إضافة كود برومو */}
<div style={{ marginTop: '15px', padding: '10px', border: `1px dashed ${theme.redBrand}`, borderRadius: '10px' }}>
  <input 
    type="text" 
    placeholder="كود الخصم" 
    onChange={(e) => setPromoCode(e.target.value)}
    style={{ width: '70%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', color: '#000' }} 
  />
  <button onClick={handleApplyPromo} style={{ width: '25%', padding: '8px', marginRight: '5%', background: '#000', color: '#fff', borderRadius: '5px', border: 'none' }}>تطبيق</button>
</div>
            {cart.length > 0 && <button onClick={() => {setIsCartOpen(false); setShowOrderForm(true);}} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '18px', borderRadius: '12px', marginTop: '20px', fontWeight: 'bold' }}>إتمام الطلب 🚀</button>}
          </div>
        </div>
      )}

      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{textAlign:'center', color: theme.redBrand, margin: '0 0 20px 0'}}>معلومات الشحن 🚚</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="الاسم الكامل" onChange={(e)=>setOrderInfo({...orderInfo, name:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ddd', color:'#000'}} />
                <input type="text" placeholder="المدينة" onChange={(e)=>setOrderInfo({...orderInfo, city:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ddd', color:'#000'}} />
                <input type="text" placeholder="العنوان" onChange={(e)=>setOrderInfo({...orderInfo, address:e.target.value})} style={{padding:'12px', borderRadius:'10px', border:'1px solid #ddd', color:'#000'}} />
              <button 
  onClick={() => {
    const total = cart.reduce((acc, item) => acc + Number(item.price), 0) * (1 - discount);
    // الرقم خاصو يكون أرقام فقط بدون زائد أو مسافات
    const whatsappNumber = "212601042910"; 
    const message = encodeURIComponent(
      `*طلب جديد من BRAYOUS_SHOP* 🚀\n\n` +
      `*الاسم:* ${orderInfo.name}\n` +
      `*المدينة:* ${orderInfo.city}\n` +
      `*العنوان:* ${orderInfo.address}\n\n` +
      `*المنتجات:* ${cart.map(i => i.name).join(', ')}\n` +
      `*المجموع النهائي:* ${total} DH`
    );
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`, '_blank');
  }} 
  style={{ 
    width: '100%', 
    backgroundColor: '#25D366', 
    color: '#fff', 
    padding: '15px', 
    borderRadius: '12px', 
    border: 'none', 
    fontWeight: 'bold', 
    marginTop: '15px',
    cursor: 'pointer'
  }}
>
  تأكيد الطلب عبر واتساب ✅
</button>
                <button onClick={()=>setShowOrderForm(false)} style={{background:'none', border:'none', color: '#999', marginTop: '10px'}}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}