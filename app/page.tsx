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
  const [activeCategory, setActiveCategory] = useState("الكل");

  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: "", city: "", address: "", size: "", color: "" });
  
  // نظام التعليقات المحلي
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
    setReviews({ ...reviews, [productId]: [...currentReviews, { ...newReview, date: new Date().toLocaleDateString() }] });
    setNewReview({ user: "", comment: "", stars: 5 });
  };

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, selectedSize: orderInfo.size, selectedColor: orderInfo.color }]);
    setSelectedItem(null);
    setIsCartOpen(true);
  };

  const handleFinalWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city) { alert("عافاك عمر معلومات الشحن"); return; }
    const cartDetails = cart.map(i => `- ${i.name} (${i.selectedSize || '؟'})`).join('%0A');
    const total = cart.reduce((acc, curr) => acc + Number(curr.price), 0);
    const message = `*طلب جديد من BRAYOUS*%0A%0A*الطلبية:*%0A${cartDetails}%0A%0A*المجموع:* ${total} DH%0A*الاسم:* ${orderInfo.name}%0A*المدينة:* ${orderInfo.city}%0A*العنوان:* ${orderInfo.address}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const theme = {
    bg: isDarkMode ? '#0f0f0f' : '#fcfcfc',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    card: isDarkMode ? '#1a1a1a' : '#ffffff',
    border: isDarkMode ? 'transparent' : 'transparent',
    shadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)',
    blueBar: '#0055ff',
    secondaryText: isDarkMode ? '#888' : '#666'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', backgroundColor: theme.card, boxShadow: theme.shadow, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.6rem', letterSpacing: '-1px' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
           <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer' }}>
             {isDarkMode ? <Sun size={22} color="#ffc107" /> : <Moon size={22} />}
           </button>
           <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ff0000', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '50%', fontWeight:'bold' }}>{cart.length}</span>}
           </div>
        </div>
      </header>

      <div style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '25px 10px', textAlign: 'center', fontWeight: '900', fontSize: '2rem' }}>BRAYOUS_SHOP</div>

      {/* البحث */}
      <div style={{ padding: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <input type="text" placeholder="قلب على الموديل اللي بغيتي..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '15px 50px 15px 20px', borderRadius: '15px', border: 'none', backgroundColor: theme.card, color: theme.text, boxShadow: theme.shadow, outline: 'none' }} />
          <Search size={20} style={{ position: 'absolute', right: '18px', top: '16px', color: '#999' }} />
        </div>
      </div>

      {/* شبكة المنتجات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px', padding: '15px' }}>
        {items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '15px', overflow: 'hidden', boxShadow: theme.shadow, cursor: 'pointer', transition: '0.2s' }}>
            <div style={{ height: '180px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={item.imageUrl} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '12px' }}>
              <h3 style={{ fontSize: '0.85rem', height: '35px', overflow: 'hidden', marginBottom: '8px' }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ff4400', fontWeight: '900', fontSize: '1.1rem' }}>{item.price} DH</span>
                {item.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.8rem' }}>{item.oldPrice} DH</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* مودال تفاصيل المنتج */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: theme.card, boxShadow: theme.shadow, zIndex: 10 }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={30} /></button>
            <strong style={{fontSize: '1.1rem'}}>تفاصيل السلعة</strong>
            <div style={{width: 30}}></div>
          </div>

          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
              
              {/* الجهة اليمنى: الصور + التعليقات */}
              <div style={{ flex: '1 1 400px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '10px', boxShadow: theme.shadow }}>
                  <img src={mainImage} style={{ width: '100%', borderRadius: '15px', objectFit: 'contain', maxHeight: '400px' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                  <img src={selectedItem.imageUrl} onClick={() => setMainImage(selectedItem.imageUrl)} style={{ width: '70px', height: '70px', borderRadius: '12px', cursor: 'pointer', border: mainImage === selectedItem.imageUrl ? `3px solid ${theme.blueBar}` : '2px solid transparent', backgroundColor: '#fff', objectFit: 'contain' }} />
                  {selectedItem.otherImages?.map((img: string, idx: number) => (
                    <img key={idx} src={img} onClick={() => setMainImage(img)} style={{ width: '70px', height: '70px', borderRadius: '12px', cursor: 'pointer', border: mainImage === img ? `3px solid ${theme.blueBar}` : '2px solid transparent', backgroundColor: '#fff', objectFit: 'contain' }} />
                  ))}
                </div>

                {/* قسم التعليقات بخطوط وهمية */}
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: theme.card, borderRadius: '20px', boxShadow: theme.shadow }}>
                  <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>آراء المشتريين 💬</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    <input type="text" placeholder="سميتك" value={newReview.user} onChange={(e) => setNewReview({...newReview, user: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }} />
                    <textarea placeholder="كيف جاتك السلعة؟" value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '80px', outline: 'none' }}></textarea>
                    <button onClick={() => handleAddReview(selectedItem._id)} style={{ backgroundColor: theme.blueBar, color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>إرسال التعليق <Send size={18}/></button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {(reviews[selectedItem._id] || []).map((rev: any, i: number) => (
                      <div key={i} style={{ paddingBottom: '15px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <strong style={{fontSize: '0.9rem'}}>{rev.user}</strong>
                          <div style={{display:'flex'}}>{[...Array(rev.stars)].map((_, i) => <Star key={i} size={12} fill="#ffcc00" color="#ffcc00"/>)}</div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: theme.secondaryText, margin: 0 }}>{rev.comment}</p>
                      </div>
                    ))}
                    {!(reviews[selectedItem._id]) && <p style={{fontSize:'0.8rem', color:'#999', textAlign:'center'}}>كن أول من يضع تعليقاً</p>}
                  </div>
                </div>
              </div>

              {/* الجهة اليسرى: الوصف والطلب */}
              <div style={{ flex: '1 1 350px' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', fontWeight: '800' }}>{selectedItem.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <span style={{ color: '#ff4400', fontSize: '2.2rem', fontWeight: '900' }}>{selectedItem.price} DH</span>
                  {selectedItem.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '1.2rem' }}>{selectedItem.oldPrice} DH</span>}
                </div>

                <div style={{ padding: '20px', backgroundColor: isDarkMode ? '#222' : '#f0f7ff', borderRadius: '15px', marginBottom: '25px' }}>
                   <h4 style={{ color: theme.blueBar, marginBottom: '10px' }}>مميزات المنتوج:</h4>
                   <p style={{ fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{selectedItem.description}</p>
                </div>

                {selectedItem.sizes && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>المقاسات المتوفرة:</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {selectedItem.sizes.map((s: string) => (
                        <button key={s} onClick={() => setOrderInfo({...orderInfo, size: s})} style={{ padding: '10px 20px', borderRadius: '10px', border: orderInfo.size === s ? `2px solid ${theme.blueBar}` : '1px solid #ddd', backgroundColor: orderInfo.size === s ? theme.blueBar : 'transparent', color: orderInfo.size === s ? '#fff' : theme.text, fontWeight: 'bold' }}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => addToCart(selectedItem)} style={{ width: '100%', backgroundColor: theme.blueBar, color: '#fff', padding: '20px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.3rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,85,255,0.3)' }}>إضافة إلى السلة 🛒</button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* نافذة الشحن (Checkout) */}
      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{textAlign:'center', marginBottom:'25px'}}>
              <h2 style={{margin:0, color: theme.blueBar}}>معلومات الشحن 🚚</h2>
              <p style={{fontSize:'0.85rem', color: theme.secondaryText}}>عمر المعلومات باش توصلك السلعة حتى للدار</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{fontSize:'0.8rem', fontWeight:'bold', display:'block', marginBottom:'5px'}}>الاسم الكامل</label>
                <input type="text" placeholder="مثال: محمد العلوي" onChange={(e)=>setOrderInfo({...orderInfo, name:e.target.value})} style={{width:'100%', padding:'15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', fontSize:'1rem', color:'#000'}} />
              </div>
              <div>
                <label style={{fontSize:'0.8rem', fontWeight:'bold', display:'block', marginBottom:'5px'}}>المدينة</label>
                <input type="text" placeholder="الدار البيضاء" onChange={(e)=>setOrderInfo({...orderInfo, city:e.target.value})} style={{width:'100%', padding:'15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', fontSize:'1rem', color:'#000'}} />
              </div>
              <div>
                <label style={{fontSize:'0.8rem', fontWeight:'bold', display:'block', marginBottom:'5px'}}>العنوان السكني</label>
                <input type="text" placeholder="رقم المنزل، اسم الشارع..." onChange={(e)=>setOrderInfo({...orderInfo, address:e.target.value})} style={{width:'100%', padding:'15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', fontSize:'1rem', color:'#000'}} />
              </div>
            </div>

            <button onClick={handleFinalWhatsApp} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>تأكيد الطلب عبر واتساب <MessageCircle size={22}/></button>
            <button onClick={()=>setShowOrderForm(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '15px', color: theme.secondaryText, fontSize:'0.9rem' }}>إلغاء والعودة</button>
          </div>
        </div>
      )}

      {/* نافذة السلة (قائمة المشتريات) */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1500 }}>
          <div style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', backgroundColor: theme.card, boxShadow: theme.shadow }}>
            <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color: theme.text}}><X size={30} /></button>
            <strong style={{fontSize:'1.2rem'}}>سلة المشتريات ({cart.length})</strong>
            <div style={{width: 30}}></div>
          </div>
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            {cart.length === 0 ? (
              <div style={{textAlign:'center', marginTop:'100px'}}>
                <ShoppingCart size={80} style={{color:'#ddd', marginBottom:'20px'}}/>
                <p>السلة خاوية، زيد شي حاجة!</p>
              </div>
            ) : (
              <>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <img src={item.imageUrl} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{item.name}</h4>
                      <p style={{ margin: '5px 0', color: '#ff4400', fontWeight: 'bold' }}>{item.price} DH</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: theme.secondaryText }}>المقاس: {item.selectedSize || 'عادي'}</p>
                    </div>
                    <button onClick={() => {const n=[...cart]; n.splice(i,1); setCart(n);}} style={{ color: 'red', border: 'none', background: 'none' }}><Trash2 size={22}/></button>
                  </div>
                ))}
                <div style={{ marginTop: '30px', padding: '20px', backgroundColor: theme.card, borderRadius: '20px', boxShadow: theme.shadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{fontSize:'1.1rem'}}>المجموع الإجمالي:</span>
                    <span style={{fontSize:'1.5rem', fontWeight:'900', color: theme.blueBar}}>{cart.reduce((a, b) => a + Number(b.price), 0)} DH</span>
                  </div>
                  <button onClick={() => {setIsCartOpen(false); setShowOrderForm(true);}} style={{ width: '100%', backgroundColor: theme.blueBar, color: '#fff', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>إتمام الطلب 🚀</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}