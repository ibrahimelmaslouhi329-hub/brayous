"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, X, Shirt, Smartphone, Footprints, 
  GraduationCap, Search, Moon, Sun, MessageCircle, Star, Trash2
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

  // State السلة والفورم
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderInfo, setOrderInfo] = useState({ name: "", city: "", address: "", size: "" });

  const whatsappNumber = "212601042910";

  // تصنيفات الأيقونات
  const categories = [
    { name: "الكل", icon: <Search size={20} /> },
    { name: "جاكيط", icon: <Shirt size={22} /> },
    { name: "سراول", icon: <Smartphone size={22} style={{transform: 'rotate(180deg)'}}/> },
    { name: "سيرڤيط", icon: <Shirt size={22} color="#0055ff" /> },
    { name: "كاسكيط", icon: <GraduationCap size={22} /> }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "product"]{
          _id, name, price, description, category,
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

    const message = `*طلب جديد من BRAYOUS*%0A%0A` +
                    `*السلعة المطلوبة:*%0A${cartDetails}%0A` +
                    `--------------------------%0A` +
                    `*المجموع:* ${total} DH%0A` +
                    `*الاسم:* ${orderInfo.name}%0A` +
                    `*المدينة:* ${orderInfo.city}%0A` +
                    `*العنوان:* ${orderInfo.address}%0A` +
                    `*المقاس:* ${orderInfo.size}%0A`;
    
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
    i.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', direction: 'rtl', transition: '0.3s', fontFamily: 'system-ui' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', alignItems: 'center', backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ color: '#ff0000', fontWeight: '900', margin: 0, fontSize: '1.4rem' }}>BRAYOUS</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border