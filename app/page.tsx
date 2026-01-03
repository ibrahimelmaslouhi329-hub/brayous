"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Shirt, Smartphone, 
  GraduationCap, Search, Moon, Sun, MessageCircle, Trash2, Star 
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

  const whatsappNumber = "212601042910";

  const categories = [
    { name: "الكل", icon: <Search size={20} /> },
    { name: "جاكيط", icon: <Shirt size={22} /> },
    { name: "سراول", icon: <Smartphone size={22} style={{transform: 'rotate(180deg)'}}/> },
    { name: "سيرڤيط", icon: <Shirt size={22} /> },
    { name: "كاسكيط", icon: <GraduationCap size={22} /> }
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

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, selectedSize: orderInfo.size, selectedColor: orderInfo.color }]);
    setSelectedItem(null);
    setIsCartOpen(true);
  };

  const handleFinalWhatsApp = () => {
    const cartDetails = cart.map(i => `- ${i.name} (${i.selectedSize || '؟'}) [${i.selectedColor || '؟'}]`).join('%0A');
    const total = cart.reduce((acc, curr) => acc + Number(curr.price), 0);
    const message = `*طلب جديد من BRAYOUS*%0A%0A*السلعة:*%0A${cartDetails}%0A%0A*المجموع:* ${total} DH%0A*الاسم:* ${orderInfo.name}%0A*المدينة:* ${orderInfo.city}%0A*العنوان:* ${orderInfo.address}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#000',
    card: isDarkMode ? '#1e1e1e' : '#fff',
    border: isDarkMode ? '#333' : '#eee',
    blueBar: '#0055ff',
    secondaryText: isDarkMode ? '#aaa' : '#666'
  };

  const filteredItems = items.filter(i => 
    (activeCategory === "الكل" || i.category === activeCategory) &&
    (i.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'sans-serif' }}>
      
      {/* Header & Blue Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', alignItems: 'center', backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.4rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
           <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}><Sun size={22} /></button>
           <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={24} />
              {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ff0000', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '50%' }}>{cart.length}</span>}
           </div>
        </div>
      </header>

      <div style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '20px 10px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem' }}>BRAYOUS_SHOP</div>

      {/* البحث والتصنيفات */}
      <div style={{ padding: '15px' }}>
        <input type="text" placeholder="قلب على السلعة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '30px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text }} />
      </div>

      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 15px 15px' }}>
        {categories.map(cat => (
          <button key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: activeCategory === cat.name ? theme.blueBar : theme.card, color: activeCategory === cat.name ? '#fff' : theme.text, display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* شبكة المنتجات */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '0.8rem', margin: '5px 0' }}>{item.name}</h3>
              <p style={{ color: '#ff4400', fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {/* مودال تفاصيل المنتج */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, backgroundColor: theme.card }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{width: 28}}></div>
          </div>

          <div style={{ padding: '15px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              
              {/* الجهة اليمنى: الصور والتقييمات */}
              <div style={{ flex: '1 1 300px' }}>
                <img src={mainImage} style={{ width: '100%', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                
                {/* الصور الإضافية */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
                  <img src={selectedItem.imageUrl} onClick={() => setMainImage(selectedItem.imageUrl)} style={{ width: '60px', height: '60px', borderRadius: '8px', cursor: 'pointer', border: mainImage === selectedItem.imageUrl ? `2px solid ${theme.blueBar}` : 'none' }} />
                  {selectedItem.otherImages?.map((img: string, idx: number) => (
                    <img key={idx} src={img} onClick={() => setMainImage(img)} style={{ width: '60px', height: '60px', borderRadius: '8px', cursor: 'pointer', border: mainImage === img ? `2px solid ${theme.blueBar}` : 'none' }} />
                  ))}
                </div>

                {/* التقييمات تحت الصورة */}
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: theme.card, borderRadius: '10px', border: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                    <Star size={16} fill="#FFD700" color="#FFD700" />
                    <span style={{ fontWeight: 'bold' }}>4.9/5</span>
                    <span style={{ fontSize: '0.8rem', color: theme.secondaryText }}>(124 تقييم)</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', borderTop: `1px solid ${theme.border}`, paddingTop: '10px' }}>
                    <p>⭐ "سلعة ناضية ووصلات دغيا" - حمزة من الرباط</p>
                    <p>⭐ "كوليتي زوينة بزاف تبارك الله" - سارة من كازا</p>
                  </div>
                </div>
              </div>

              {/* الجهة اليسرى: الوصف والخيارات */}
              <div style={{ flex: '1 1 300px' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{selectedItem.name}</h2>
                <p style={{ color: '#ff4400', fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedItem.price} DH</p>
                
                {/* الوصف مقسم */}
                <div style={{ margin: '20px 0', padding: '15px', backgroundColor: isDarkMode ? '#222' : '#f9f9f9', borderRadius: '10px' }}>
                  <h4 style={{ marginBottom: '5px', color: theme.blueBar }}>وصف المنتج:</h4>
                  <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: '1.6' }}>{selectedItem.description}</p>
                </div>

                {/* خيارات الألوان */}
                {selectedItem.colors && (
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>الألوان المتاحة:</span>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                      {selectedItem.colors.map((col: string) => (
                        <button key={col} onClick={() => setOrderInfo({...orderInfo, color: col})} style={{ padding: '5px 15px', borderRadius: '15px', border: `1px solid ${orderInfo.color === col ? theme.blueBar : theme.border}`, backgroundColor: orderInfo.color === col ? theme.blueBar : theme.card, color: orderInfo.color === col ? '#fff' : theme.text }}>{col}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* خيارات المقاسات */}
                {selectedItem.sizes && (
                  <div style={{ marginBottom: '25px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>المقاسات (Taille):</span>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                      {selectedItem.sizes.map((sz: string) => (
                        <button key={sz} onClick={() => setOrderInfo({...orderInfo, size: sz})} style={{ width: '40px', height: '40px', borderRadius: '50%', border: `1px solid ${orderInfo.size === sz ? theme.blueBar : theme.border}`, backgroundColor: orderInfo.size === sz ? theme.blueBar : theme.card, color: orderInfo.size === sz ? '#fff' : theme.text }}>{sz}</button>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => addToCart(selectedItem)} style={{ width: '100%', backgroundColor: theme.blueBar, color: '#fff', padding: '18px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>إضافة إلى السلة</button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* نافذة السلة والفورم (نفس الكود السابق مع تحسينات بسيطة) */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1500 }}>
          <div style={{ padding: '15px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong>سلة المشتريات ({cart.length})</strong>
            <div style={{width: 28}}></div>
          </div>
          <div style={{ padding: '20px' }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
                <div>
                  <p style={{margin:0, fontWeight:'bold'}}>{item.name}</p>
                  <p style={{margin:0, fontSize:'0.8rem', color: theme.secondaryText}}>المقاس: {item.selectedSize} | اللون: {item.selectedColor}</p>
                </div>
                <button onClick={() => {const n=[...cart]; n.splice(i,1); setCart(n);}} style={{color:'red', border:'none', background:'none'}}><Trash2 size={20}/></button>
              </div>
            ))}
            <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '15px', borderRadius: '10px', marginTop: '20px', border:'none', fontWeight:'bold' }}>تأكيد الطلب</button>
          </div>
        </div>
      )}

      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '15px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{textAlign:'center'}}>معلومات الشحن</h3>
            <input type="text" placeholder="الاسم" onChange={(e)=>setOrderInfo({...orderInfo, name:e.target.value})} style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd', color:'#000'}} />
            <input type="text" placeholder="المدينة" onChange={(e)=>setOrderInfo({...orderInfo, city:e.target.value})} style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd', color:'#000'}} />
            <input type="text" placeholder="العنوان" onChange={(e)=>setOrderInfo({...orderInfo, address:e.target.value})} style={{width:'100%', padding:'12px', margin:'10px 0', borderRadius:'8px', border:'1px solid #ddd', color:'#000'}} />
            <button onClick={handleFinalWhatsApp} style={{width:'100%', backgroundColor:'#25D366', color:'#fff', padding:'15px', borderRadius:'10px', border:'none', fontWeight:'bold'}}>إرسال عبر واتساب</button>
            <button onClick={()=>setShowOrderForm(false)} style={{width:'100%', background:'none', border:'none', marginTop:'10px', color: theme.secondaryText}}>إلغاء</button>
          </div>
        </div>
      )}

    </div>
  );
}