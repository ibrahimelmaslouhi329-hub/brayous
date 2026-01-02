import { createClient } from "next-sanity";

// إعداد الاتصال بـ Sanity (الـ ID ديالك هو t6a3pwpc)
const client = createClient({
  projectId: "t6a3pwpc",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export default async function IndexPage() {
  // جلب البيانات من Sanity
  const products = await client.fetch(`*[_type == "product"]{
    name,
    price,
    "imageUrl": image.asset->url,
    description
  }`);

  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* --- HEADER (اللوغو والسلة) --- */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 5%', 
        backgroundColor: '#ffffff', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* اللوغو: تقدري تعوضي src برابط تصويرة اللوغو ديالك */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3159/3159614.png" 
            alt="Logo" 
            style={{ width: '40px', height: '40px' }} 
          />
          <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px', color: '#333' }}>BRAYOUS</span>
        </div>

        {/* أيقونة السلة */}
        <div style={{ fontSize: '26px', cursor: 'pointer', position: 'relative' }}>
          🛒
          <span style={{ 
            position: 'absolute', top: '-5px', right: '-10px', 
            backgroundColor: '#e44d26', color: 'white', 
            borderRadius: '50%', padding: '2px 6px', fontSize: '12px' 
          }}>0</span>
        </div>
      </nav>

      {/* --- العنوان الرئيسي --- */}
      <div style={{ padding: '40px 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', color: '#222', marginBottom: '10px' }}>مجموعة الملابس الجديدة</h2>
        <p style={{ color: '#666' }}>اكتشف أحدث صيحات الموضة في متجرنا</p>
      </div>

      {/* --- عرض المنتجات --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px', 
        padding: '0 5% 50px 5%' 
      }}>
        {products.map((product: any) => (
          <div key={product.name} style={{ 
            backgroundColor: '#fff', 
            borderRadius: '15px', 
            overflow: 'hidden', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s'
          }}>
            {/* صورة المنتج */}
            <div style={{ width: '100%', height: '350px', backgroundColor: '#eee', overflow: 'hidden' }}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            {/* تفاصيل المنتج */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#e44d26', margin: '0 0 15px 0' }}>{product.price} DH</p>
              
              {/* زر الواتساب الاحترافي */}
              <a 
                href={`https://wa.me/212601042010?text=السلام_عليكم_بغيت_نطلب_${product.name}`} 
                target="_blank"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  backgroundColor: '#25D366', 
                  color: '#fff', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                <span>طلب عبر واتساب</span>
                <span>💬</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}