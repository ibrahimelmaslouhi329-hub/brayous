"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Search, Moon, Sun, MessageCircle, Trash2, Star, Send,
  User, MapPin, Home, Truck // أيقونات الشحن
} from 'lucide-react';
// أيقونات الفئات المخصصة
const CategoryIcons: any = {
  "سروال": "👖",
  "جاكيط": "🧥",
  "قبية": "👕",
  "طرابش": "🧢",
  "سيرڤيت": "🏃",
  "الكل": "🛍️"
};

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mainImage, setMainImage] = useState("");
  
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: "", city: "", address: "", size: "", color: "" });
  
  const [reviews, setReviews] = useState<any>({});
  const [newReview, setNewReview] = useState({ user: "", comment: "", stars: 5 });

  const whatsappNumber = "212601042910";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, oldPrice, description, category, sizes, colors,
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
    setReviews({ ...reviews, [productId]: [...currentReviews, { ...newReview }] });
    setNewReview({ user: "", comment: "", stars: 5 });
  };

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, selectedSize: orderInfo.size }]);
    setSelectedItem(null);
    setIsCartOpen(true);
  };

  const handleFinalWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city || !orderInfo.address) { alert("عافاك عمر معلومات الشحن كاملة"); return; }
    const cartDetails = cart.map(i => `- ${i.name}`).join('%0A');
    const total = cart.reduce((acc, curr) => acc + Number(curr.price), 0);
    const message = `*طلب جديد BRAYOUS*%0A%0A*السلعة:*%0A${cartDetails}%0A%0A*المجموع:* ${total} DH%0A*الاسم:* ${orderInfo.name}%0A*المدينة:* ${orderInfo.city}%0A*العنوان:* ${orderInfo.address}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const theme = {
    bg: isDarkMode ? '#0f0f0f' : '#fcfcfc',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    card: isDarkMode ? '#1a1a1a' : '#ffffff',
    shadow: '0 4px 15px rgba(0,0,0,0.08)',
    redBrand: '#ff0000',
    secondaryText: isDarkMode ? '#aaa' : '#666'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', backgroundColor: theme.card, boxShadow: theme.shadow, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: theme.redBrand, fontWeight: '900', margin: 0, fontSize: '1.6rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
           <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer' }}>
             {isDarkMode ? <Sun size={22} color="#ffcc00" /> : <Moon size={22} />}
           </button>
           <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: theme.redBrand, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold' }}>{cart.length}</span>}
           </div>
        </div>
      </header>

      {/* الشريط الأحمر */}
      <div style={{ backgroundColor: theme.redBrand, color: '#fff', padding: '30px 10px', textAlign: 'center', fontWeight: '900', fontSize: '2.2rem' }}>
        BRAYOUS_SHOP
      </div>

      {/* البحث */}
      <div style={{ padding: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <input type="text" placeholder="قلب على السلعة..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '15px 45px 15px 15px', borderRadius: '15px', border: 'none', backgroundColor: theme.card, color: theme.text, boxShadow: theme.shadow, outline: 'none' }} />
          <Search size={20} style={{ position: 'absolute', right: '15px', top: '16px', color: '#999' }} />
        </div>
      </div>

      {/* شبكة المنتجات (2 في كل سطر) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px' }}>
        {items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '15px', overflow: 'hidden', boxShadow: theme.shadow, cursor: 'pointer', transition: '0.2s' }}>
            <div style={{ height: '180px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <img src={item.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              {/* أيقونة الفئة في زاوية المنتج */}
              <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(255,255,255,0.8)', padding: '4px', borderRadius: '8px', fontSize: '1.2rem' }}>
                {CategoryIcons[item.category] || "📦"}
              </span>
            </div>
            <div style={{ padding: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', height: '35px', overflow: 'hidden', margin: '0 0 10px 0' }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: theme.redBrand, fontWeight: '900', fontSize: '1.1rem' }}>{item.price} DH</span>
                {item.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.8rem' }}>{item.oldPrice} DH</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* مودال التفاصيل المصمم للحاسوب والهاتف */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: theme.card, boxShadow: theme.shadow, zIndex: 10 }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={30} /></button>
            <strong style={{fontSize: '1.1rem'}}>تفاصيل السلعة</strong>
            <div style={{width: 30}}></div>
          </div>

          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
              
              {/* القسم الأيمن: معرض الصور */}
              <div style={{ flex: '1 1 400px', width: '100%' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '15px', boxShadow: theme.shadow, textAlign: 'center' }}>
                  <img src={mainImage} alt="" style={{ maxWidth: '100%', maxHeight: '450px', borderRadius: '15px', objectFit: 'contain' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                  {[selectedItem.imageUrl, ...(selectedItem.otherImages || [])].map((img, idx) => (
                    <img key={idx} src={img} alt="" onClick={() => setMainImage(img)} style={{ width: '75px', height: '75px', borderRadius: '12px', border: mainImage === img ? `3px solid ${theme.redBrand}` : '1px solid #ddd', cursor: 'pointer', objectFit: 'cover', backgroundColor: '#fff' }} />
                  ))}
                </div>
              </div>

              {/* القسم الأيسر: المعلومات والطلب */}
              <div style={{ flex: '1 1 350px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                   <span style={{ fontSize: '1.5rem' }}>{CategoryIcons[selectedItem.category] || "📦"}</span>
                   <span style={{ color: theme.secondaryText, fontSize: '0.9rem' }}>فئة {selectedItem.category}</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>{selectedItem.name}</h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '25px' }}>
                   <span style={{ color: theme.redBrand, fontSize: '2.5rem', fontWeight: '900' }}>{selectedItem.price} DH</span>
                   {selectedItem.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '1.2rem' }}>{selectedItem.oldPrice} DH</span>}
                </div>

                <div style={{ padding: '20px', backgroundColor: isDarkMode ? '#222' : '#f0f0f0', borderRadius: '15px', marginBottom: '30px' }}>
                   <h4 style={{ color: theme.redBrand, marginTop: 0 }}>وصف المنتج:</h4>
                   <p style={{ fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{selectedItem.description}</p>
                </div>

                <button onClick={() => addToCart(selectedItem)} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '20px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.3rem', boxShadow: '0 10px 20px rgba(255,0,0,0.2)' }}>أضف إلى السلة 🛒</button>
              </div>
            </div>

            {/* نظام التعليقات بالخطوط الوهمية */}
            <div style={{ marginTop: '50px', padding: '25px', backgroundColor: theme.card, borderRadius: '20px', boxShadow: theme.shadow }}>
                <h3 style={{ marginBottom: '20px' }}>آراء الزبناء ⭐</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {(reviews[selectedItem._id] || []).map((rev: any, i: number) => (
                      <div key={i} style={{ padding: '15px', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                           <strong style={{fontSize:'1rem'}}>{rev.user}</strong>
                           <div style={{display:'flex'}}>{[...Array(rev.stars)].map((_, j) => <Star key={j} size={14} fill="#ffcc00" color="#ffcc00"/>)}</div>
                        </div>
                        <p style={{fontSize:'0.9rem', color: theme.secondaryText, margin:0}}>{rev.comment}</p>
                      </div>
                   ))}
                </div>
                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <input type="text" placeholder="سميتك..." value={newReview.user} onChange={(e)=>setNewReview({...newReview, user:e.target.value})} style={{padding:'15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none'}} />
                   <textarea placeholder="كيف جاتك السلعة؟" value={newReview.comment} onChange={(e)=>setNewReview({...newReview, comment:e.target.value})} style={{padding:'15px', borderRadius:'12px', border:'1px solid #ddd', minHeight:'100px', outline:'none'}} />
                   <button onClick={() => handleAddReview(selectedItem._id)} style={{ backgroundColor: theme.redBrand, color:'#fff', padding:'15px', borderRadius:'12px', border:'none', fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>نشر التقييم <Send size={18}/></button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة الشحن مع علامة الشاحنة والمعلومات الكاملة */}
      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div style={{textAlign:'center', marginBottom:'25px'}}>
              <div style={{ backgroundColor: '#fff5f5', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <Truck size={35} color={theme.redBrand} />
              </div>
              <h2 style={{margin:0, color: theme.redBrand}}>معلومات الشحن 🚚</h2>
              <p style={{fontSize:'0.85rem', color: theme.secondaryText, marginTop:'5px'}}>توصيل سريع حتى لباب الدار</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{position:'relative'}}>
                  <User size={18} style={{position:'absolute', right:'12px', top:'15px', color:'#999'}} />
                  <input type="text" placeholder="الاسم الكامل" onChange={(e)=>setOrderInfo({...orderInfo, name:e.target.value})} style={{width:'100%', padding:'15px 40px 15px 15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', fontSize:'1rem', color:'#000'}} />
                </div>
                <div style={{position:'relative'}}>
                  <MapPin size={18} style={{position:'absolute', right:'12px', top:'15px', color:'#999'}} />
                  <input type="text" placeholder="المدينة" onChange={(e)=>setOrderInfo({...orderInfo, city:e.target.value})} style={{width:'100%', padding:'15px 40px 15px 15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', fontSize:'1rem', color:'#000'}} />
                </div>
                <div style={{position:'relative'}}>
                  <Home size={18} style={{position:'absolute', right:'12px', top:'15px', color:'#999'}} />
                  <input type="text" placeholder="العنوان السكني بالتفصيل" onChange={(e)=>setOrderInfo({...orderInfo, address:e.target.value})} style={{width:'100%', padding:'15px 40px 15px 15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', fontSize:'1rem', color:'#000'}} />
                </div>
            </div>

            <button onClick={handleFinalWhatsApp} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>تأكيد الطلب عبر واتساب <MessageCircle size={22}/></button>
            <button onClick={()=>setShowOrderForm(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '15px', color: theme.secondaryText }}>إلغاء والرجوع</button>
          </div>
        </div>
      )}

      {/* نافذة السلة */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1500 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', backgroundColor: theme.card, alignItems: 'center' }}>
            <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color: theme.text}}><X size={30} /></button>
            <strong style={{fontSize:'1.2rem'}}>سلة المشتريات ({cart.length})</strong>
            <div style={{width: 30}}></div>
          </div>
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                    <img src={item.imageUrl} style={{width:'60px', height:'60px', borderRadius:'10px', objectFit:'cover'}} />
                    <div>
                        <h4 style={{margin:0, fontSize:'0.95rem'}}>{item.name}</h4>
                        <p style={{margin:0, color: theme.redBrand, fontWeight:'bold'}}>{item.price} DH</p>
                    </div>
                </div>
                <button onClick={() => {const n=[...cart]; n.splice(i,1); setCart(n);}} style={{color:'red', border:'none', background:'none'}}><Trash2 size={22}/></button>
              </div>
            ))}
            {cart.length > 0 && (
              <div style={{marginTop:'30px', padding:'20px', backgroundColor: theme.card, borderRadius:'20px', boxShadow: theme.shadow}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', fontSize:'1.3rem', fontWeight:'900'}}>
                   <span>المجموع الإجمالي:</span>
                   <span style={{color: theme.redBrand}}>{cart.reduce((a, b) => a + Number(b.price), 0)} DH</span>
                </div>
                <button onClick={() => {setIsCartOpen(false); setShowOrderForm(true);}} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '20px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.3rem' }}>إتمام الطلب الآن 🚀</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}