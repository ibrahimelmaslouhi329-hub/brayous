export const product = {
    name: 'product',
    title: 'المنتجات',
    type: 'document',
    fields: [
      { name: 'name', title: 'اسم المنتج', type: 'string' },
      { name: 'price', title: 'الثمن (DH)', type: 'number' },
      { name: 'category', title: 'الصنف', type: 'string', options: { list: [
        { title: 'ملابس رجال', value: 'ملابس رجال' },
        { title: 'سراول', value: 'سراول' },
        { title: 'كاسكيطات', value: 'كاسكيطات' },
        { title: 'سبرديلات', value: 'سبرديلات' },
      ]}},
      { name: 'image', title: 'الصورة الرئيسية', type: 'image', options: { hotspot: true } },
      // إضافة صور إضافية
      { name: 'images', title: 'صور إضافية للمنتج', type: 'array', of: [{ type: 'image' }] },
      { name: 'description', title: 'وصف المنتج', type: 'text' },
      // إضافة الألوان والمقاسات
      { name: 'sizes', title: 'المقاسات المتوفرة (مثلا: M, L, XL أو 40, 41)', type: 'string' },
      { name: 'colors', title: 'الألوان المتوفرة', type: 'string' },
    ],
}