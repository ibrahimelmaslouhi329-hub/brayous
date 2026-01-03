"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Search, Moon, Sun, MessageCircle, Trash2, Star, Send,
  User, MapPin, Home, Truck 
} from 'lucide-react';
import { createClient } from 'next-sanity';

// إعدادات Sanity
const client = createClient({
  projectId: "t6a3pwpc", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// مصفوفة الفئات بالأيقونات ديالها
const categories = [
  { name: "الكل", icon: "🛍️" },
  { name: "جاكيط", icon: "🧥" },
  { name: "سروال", icon: "👖" },
  { name: "قبية", icon: "👕" },
  { name: "طرابش", icon: "🧢" },
  { name: "سيرڤيت", icon: "🏃" },
];

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mainImage, setMainImage] = useState("");
  
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: "", city: "", address: "", size: "" });
  
  const [reviews, setReviews] = useState<any>({});
  const [newReview, setNewReview] = useState({ user: "", comment: "", stars: 5 });

  const whatsappNumber = "212601042910";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, oldPrice, description, category, sizes,
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
    setCart([...cart, { ...product }]);
    setSelectedItem(null);
    setIsCartOpen(true);
  };

  const handleFinalWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city || !orderInfo.address) { alert("عمر معلومات الشحن"); return; }
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

  // تصفية المنتجات حسب البحث والفئة
  const filteredItems = items.filter(i => 
    (activeCategory === "الكل" || i.category === activeCategory) &&
    (i.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', alignItems: 'center', backgroundColor: theme.card, boxShadow: theme.shadow, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: theme.redBrand, fontWeight: '900', margin: 0, fontSize: '1.6rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
           <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer' }}>{isDarkMode ? <Sun size={22} color="#ffcc00" /> : <Moon size={22} />}</button>
           <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: theme.redBrand, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold' }}>{cart.length}</span>}
           </div>
        </div>
      </header>

      <div style={{ backgroundColor: theme.redBrand, color: '#fff', padding: '20px 10px', textAlign: 'center', fontWeight: '900', fontSize: '1.8rem' }}>BRAYOUS_SHOP</div>

      {/* البحث */}
      <div style={{ padding: '20px 20px 10px' }}>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <input type="text" placeholder="قلب على الموديل..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '15px 45px 15px 15px', borderRadius: '15px', border: 'none', backgroundColor: theme.card, color: theme.text, boxShadow: theme.shadow, outline: 'none' }} />
          <Search size={20} style={{ position: 'absolute', right: '15px', top: '16px', color: '#999' }} />
        </div>
      </div>

      {/* قائمة الفئات بالأيقونات (تحت البحث) */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '10px 20px 20px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <div 
            key={cat.name} 
            onClick={() => setActiveCategory(cat.name)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              minWidth: '70px'
            }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: activeCategory === cat.name ? theme.redBrand : theme.card, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.8rem',
              boxShadow: theme.shadow,
              transition: '0.3s',
              border: activeCategory === cat.name ? `2px solid ${theme.redBrand}` : '2px solid transparent'
            }}>
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: activeCategory === cat.name ? 'bold' : 'normal', color: activeCategory === cat.name ? theme.redBrand : theme.text }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* شبكة المنتجات */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '15px', overflow: 'hidden', boxShadow: theme.shadow }}>
            <div style={{ height: '170px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={item.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '12px' }}>
              <h3 style={{ fontSize: '0.85rem', height: '35px', overflow: 'hidden', margin: '0 0 8px 0' }}>{item.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: theme.redBrand, fontWeight: '900' }}>{item.price} DH</span>
                {item.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.75rem' }}>{item.oldPrice} DH</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* مودال التفاصيل (مريح للعين) */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, backgroundColor: theme.card, boxShadow: theme.shadow, zIndex: 10 }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={30} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{width: 30}}></div>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '15px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 350px' }}>
                <img src={mainImage} alt="" style={{ width: '100%', borderRadius: '15px', backgroundColor: '#fff', boxShadow: theme.shadow }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
                  {[selectedItem.imageUrl, ...(selectedItem.otherImages || [])].map((img, idx) => (
                    <img key={idx} src={img} alt="" onClick={() => setMainImage(img)} style={{ width: '65px', height: '65px', borderRadius: '10px', border: mainImage === img ? `2px solid ${theme.redBrand}` : '1px solid #ddd', cursor: 'pointer', backgroundColor: '#fff', objectFit: 'contain' }} />
                  ))}
                </div>
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{selectedItem.name}</h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '15px 0' }}>
                  <span style={{ color: theme.redBrand, fontSize: '2rem', fontWeight: '900' }}>{selectedItem.price} DH</span>
                  {selectedItem.oldPrice && <span style={{ color: '#999', textDecoration: 'line-through' }}>{selectedItem.oldPrice} DH</span>}
                </div>
                <div style={{ padding: '15px', backgroundColor: isDarkMode ? '#222' : '#f5f5f5', borderRadius: '12px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{selectedItem.description}</p>
                </div>
                <button onClick={() => addToCart(selectedItem)} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>إضافة إلى السلة</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* فورم الشحن مع أيقونة الشاحنة */}
      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '25px', width: '100%', maxWidth: '400px' }}>
            <div style={{textAlign:'center', marginBottom:'20px'}}>
              <Truck size={40} color={theme.redBrand} style={{margin:'0 auto 10px'}} />
              <h2 style={{margin:0, color: theme.redBrand}}>معلومات الشحن 🚚</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="الاسم الكامل" onChange={(e)=>setOrderInfo({...orderInfo, name:e.target.value})} style={{width:'100%', padding:'15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', color:'#000'}} />
                <input type="text" placeholder="المدينة" onChange={(e)=>setOrderInfo({...orderInfo, city:e.target.value})} style={{width:'100%', padding:'15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', color:'#000'}} />
                <input type="text" placeholder="العنوان بالتفصيل" onChange={(e)=>setOrderInfo({...orderInfo, address:e.target.value})} style={{width:'100%', padding:'15px', borderRadius:'12px', border:'1px solid #ddd', outline:'none', color:'#000'}} />
            </div>
            <button onClick={handleFinalWhatsApp} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '20px' }}>تأكيد الطلب (واتساب)</button>
            <button onClick={()=>setShowOrderForm(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '10px', color: theme.secondaryText }}>إلغاء</button>
          </div>
        </div>
      )}

      {/* السلة */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1500 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color: theme.text}}><X size={30} /></button>
            <strong>السلة ({cart.length})</strong>
            <div style={{width: 30}}></div>
          </div>
          <div style={{ padding: '20px' }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <h4 style={{margin:0}}>{item.name}</h4>
                  <p style={{margin:0, color: theme.redBrand, fontWeight:'bold'}}>{item.price} DH</p>
                </div>
                <button onClick={() => {const n=[...cart]; n.splice(i,1); setCart(n);}} style={{color:'red', border:'none', background:'none'}}><Trash2 size={22}/></button>
              </div>
            ))}
            {cart.length > 0 && <button onClick={() => {setIsCartOpen(false); setShowOrderForm(true);}} style={{ width: '100%', backgroundColor: theme.redBrand, color: '#fff', padding: '18px', borderRadius: '12px', marginTop: '20px' }}>إتمام الطلب 🚀</button>}
          </div>
        </div>
      )}
    </div>
  );
}