export const product = {
  name: 'product',
  title: 'الملابس',
  type: 'document',
  fields: [
    { name: 'name', title: 'اسم القطعة', type: 'string' },
    { name: 'price', title: 'الثمن (DH)', type: 'number' },
    { name: 'image', title: 'صورة المنتج', type: 'image', options: { hotspot: true } },
    { name: 'description', title: 'وصف قصير', type: 'text' }
  ]
}