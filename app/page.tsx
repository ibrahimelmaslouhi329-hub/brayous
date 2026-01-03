"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Shirt, Smartphone, 
  GraduationCap, Search, Moon, Sun, MessageCircle, Trash2, Star, Send 
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
    setCart([...cart, { ...product, selectedSize: orderInfo.size, selectedColor: orderInfo.color }]);
    setSelectedItem(null);
    setIsCartOpen(true);
  };

  const handleFinalWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city) { alert("عافاك عمر المعلومات"); return; }
    const cartDetails = cart.map(i => `- ${i.name}`).join('%0A');
    const total = cart.reduce((acc, curr) => acc + Number(curr.price), 0);
    const message = `*طلب جديد BRAYOUS*%0A%0A*السلعة:*%0A${cartDetails}%0A%0A*المجموع:* ${total} DH%0A*الاسم:* ${orderInfo.name}%0A*المدينة:* ${orderInfo.city}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const theme = {
    bg: isDarkMode ? '#0f0f0f' : '#fcfcfc',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    card: isDarkMode ? '#1a1a1a' : '#ffffff',
    shadow: '0 2px 10px rgba(0,0,0,0.05)',
    redBrand: '#ff0000',
    secondaryText: isDarkMode ? '#888' : '#666' // هادي اللي كانت ناقصة ومزيودة دابا
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui, sans-serif' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', backgroundColor: theme.card, boxShadow: theme.shadow, position: 'sticky', top: 0, zIndex: 100 }}>
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

      <div style={{ backgroundColor: theme.redBrand, color: '#fff', padding: '25px 10px', textAlign: 'center', fontWeight: '900', fontSize: '2rem' }}>
        BRAYOUS_SHOP
      </div>

      <div style={{ padding: '15px' }}>
        <div style={{ position: 'relative' }}>
          <input type="text" placeholder="قلب هنا..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 15px', borderRadius: '10px', border: 'none', backgroundColor: theme.card, color: theme.text, boxShadow: theme.shadow, outline: 'none' }} />
          <Search size={18} style={{ position: 'absolute', right: '15px', top: '14px', color: '#999' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px' }}>
        {items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadow, cursor: 'pointer' }}>
            <div style={{ height: '160px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={item.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '0.8rem', height: '32px', overflow: 'hidden', margin: '0 0 8px 0' }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: theme.redBrand, fontWeight: '900' }}>{item.price} DH</span>
                {item.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.7rem' }}>{item.oldPrice} DH</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: theme.card, boxShadow: theme.shadow }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{width: 28}}></div>
          </div>

          <div style={{ padding: '15px' }}>
            <img src={mainImage} alt="" style={{ width: '100%', borderRadius: '15px', backgroundColor: '#fff' }} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto' }}>
              {[selectedItem.imageUrl, ...(selectedItem.otherImages || [])].map((img, idx) => (
                <img key={idx} src={img} alt="" onClick={() => setMainImage(img)} style={{ width: '60px', height: '60px', borderRadius: '8px', border: mainImage === img ? `2px solid ${theme.redBrand}` : '1px solid #ddd', objectFit: 'cover', backgroundColor: '#fff' }} />
              ))}
            </div>

            <h2 style={{ fontSize: '1.3rem', margin: '15px 0 5px' }}>{selectedItem.name}</h2>
            <p style={{ color: theme.redBrand, fontSize: '1.8rem', fontWeight: '900' }}>{selectedItem.price} DH</p>
            
            <div style={{ padding: '15px', backgroundColor: isDarkMode ? '#222' : '#f9f9f9', borderRadius: '12px', marginBottom: '20px' }}>
               <p style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line', color: theme.secondaryText }}>{selectedItem.description}</p>
            </div>

            <button onClick={() => addToCart(selectedItem)} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>إضافة إلى السلة</button>
            
            {/* قسم التعليقات */}
            <div style={{ marginTop: '25px', padding: '15px', backgroundColor: theme.card, borderRadius: '12px', boxShadow: theme.shadow }}>
              <h4 style={{ marginBottom: '10px' }}>التعليقات</h4>
              {(reviews[selectedItem._id] || []).map((rev: any, i: number) => (
                <div key={i} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>{rev.user}</p>
                  <p style={{ fontSize: '0.85rem', color: theme.secondaryText, margin: '5px 0' }}>{rev.comment}</p>
                </div>
              ))}
              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="سميتك" value={newReview.user} onChange={(e)=>setNewReview({...newReview, user:e.target.value})} style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />
                <textarea placeholder="رأيك في المنتج" value={newReview.comment} onChange={(e)=>setNewReview({...newReview, comment:e.target.value})} style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />
                <button onClick={() => handleAddReview(selectedItem._id)} style={{ backgroundColor: theme.redBrand, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px' }}>إضافة تقييم</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة السلة وفورم الشحن كيبقاو نفسهم ولكن مع تصحيح zIndex */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1500 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color: theme.text}}><X size={30} /></button>
            <strong>سلة المشتريات ({cart.length})</strong>
            <div style={{width: 30}}></div>
          </div>
          <div style={{ padding: '20px' }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span>{item.name}</span>
                <button onClick={() => {const n=[...cart]; n.splice(i,1); setCart(n);}} style={{color:'red', border:'none', background:'none'}}><Trash2 size={18}/></button>
              </div>
            ))}
            {cart.length > 0 && <button onClick={() => {setIsCartOpen(false); setShowOrderForm(true);}} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '15px', borderRadius: '10px', marginTop: '20px' }}>شراء الآن</button>}
          </div>
        </div>
      )}

      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '20px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{textAlign:'center'}}>معلومات الشحن</h3>
            <input type="text" placeholder="الاسم" onChange={(e)=>setOrderInfo({...orderInfo, name:e.target.value})} style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'10px', border:'1px solid #ddd'}} />
            <input type="text" placeholder="المدينة" onChange={(e)=>setOrderInfo({...orderInfo, city:e.target.value})} style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'10px', border:'1px solid #ddd'}} />
            <button onClick={handleFinalWhatsApp} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '15px', borderRadius: '10px', border:'none', fontWeight:'bold' }}>تأكيد عبر واتساب</button>
            <button onClick={()=>setShowOrderForm(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', color: '#999' }}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}