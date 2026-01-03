"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Shirt, Smartphone, Footprints, 
  GraduationCap, Search, Moon, Sun, MessageCircle, Trash2 
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
  const [orderInfo, setOrderInfo] = useState({ name: "", city: "", address: "", size: "" });

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
          _id, name, price, description, category,
          "imageUrl": image.asset->url
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
    setCart([...cart, product]);
    setSelectedItem(null);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleFinalWhatsApp = () => {
    if (!orderInfo.name || !orderInfo.city || !orderInfo.address) {
      alert("عافاك كمل المعلومات ديالك");
      return;
    }
    const cartDetails = cart.map(i => `- ${i.name} (${i.price} DH)`).join('%0A');
    const total = cart.reduce((acc, curr) => acc + Number(curr.price), 0);
    const message = `*طلب جديد من BRAYOUS*%0A%0A*السلعة:*%0A${cartDetails}%0A%0A*المجموع:* ${total} DH%0A*الاسم:* ${orderInfo.name}%0A*المدينة:* ${orderInfo.city}%0A*العنوان:* ${orderInfo.address}%0A*المقاس:* ${orderInfo.size}`;
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
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', alignItems: 'center', backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.4rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.text }}>
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
            <ShoppingCart size={24} />
            {cart.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ff0000', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '50%' }}>{cart.length}</span>}
          </div>
        </div>
      </header>

      <div style={{ backgroundColor: theme.blueBar, color: '#fff', padding: '20px 10px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.8rem' }}>BRAYOUS_SHOP</div>

      <div style={{ padding: '15px 20px' }}>
        <div style={{ position: 'relative' }}>
          <input type="text" placeholder="قلب على السلعة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 45px 12px 15px', borderRadius: '30px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, outline: 'none' }} />
          <Search size={20} style={{ position: 'absolute', right: '15px', top: '12px', color: '#999' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 20px' }}>
        {categories.map(cat => (
          <div key={cat.name} onClick={() => setActiveCategory(cat.name)} style={{ textAlign: 'center', cursor: 'pointer', minWidth: '60px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', backgroundColor: activeCategory === cat.name ? theme.blueBar : theme.card, color: activeCategory === cat.name ? '#fff' : theme.text, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}` }}>{cat.icon}</div>
            <span style={{ fontSize: '0.7rem' }}>{cat.name}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px' }}>
        {filteredItems.map((item, index) => (
          <div key={index} onClick={() => setSelectedItem(item)} style={{ backgroundColor: theme.card, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            <img src={item.imageUrl} style={{ width: '100%', height: '160px', objectFit: 'contain', backgroundColor: '#fff' }} alt="" />
            <div style={{ padding: '8px' }}>
              <h3 style={{ fontSize: '0.75rem', height: '32px', overflow: 'hidden' }}>{item.name}</h3>
              <p style={{ color: '#ff4400', fontWeight: 'bold' }}>{item.price} DH</p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ padding: '15px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', backgroundColor: theme.card }}>
            <button onClick={() => setSelectedItem(null)} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong>تفاصيل المنتج</strong>
            <div style={{width: 28}}></div>
          </div>
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <img src={mainImage} style={{ width: '100%', borderRadius: '12px' }} alt="" />
            <h2>{selectedItem.name}</h2>
            <p style={{ color: '#ff4400', fontSize: '1.8rem', fontWeight: 'bold' }}>{selectedItem.price} DH</p>
            <p style={{ color: theme.secondaryText }}>{selectedItem.description}</p>
            <button onClick={() => addToCart(selectedItem)} style={{ width: '100%', backgroundColor: theme.blueBar, color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', marginTop: '20px' }}>إضافة إلى السلة</button>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.bg, zIndex: 1500 }}>
          <div style={{ padding: '15px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', color: theme.text}}><X size={28} /></button>
            <strong>السلة ({cart.length})</strong>
            <div style={{width: 28}}></div>
          </div>
          <div style={{ padding: '20px' }}>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
                <span>{item.name}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{fontWeight:'bold'}}>{item.price} DH</span>
                  <button onClick={() => removeFromCart(i)} style={{background:'none', border:'none', color:'red'}}><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {cart.length > 0 && (
              <button onClick={() => setShowOrderForm(true)} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '15px', borderRadius: '10px', marginTop: '20px', border: 'none', fontWeight: 'bold' }}>طلب عبر واتساب</button>
            )}
          </div>
        </div>
      )}

      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '15px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ textAlign: 'center' }}>معلومات التوصيل</h3>
            <input type="text" placeholder="الاسم" onChange={(e) => setOrderInfo({...orderInfo, name: e.target.value})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <input type="text" placeholder="المدينة" onChange={(e) => setOrderInfo({...orderInfo, city: e.target.value})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <input type="text" placeholder="العنوان" onChange={(e) => setOrderInfo({...orderInfo, address: e.target.value})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <input type="text" placeholder="المقاس" onChange={(e) => setOrderInfo({...orderInfo, size: e.target.value})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
            <button onClick={handleFinalWhatsApp} style={{ width: '100%', backgroundColor: '#25D366', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>تأكيد وإرسال</button>
            <button onClick={() => setShowOrderForm(false)} style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: theme.secondaryText }}>إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}