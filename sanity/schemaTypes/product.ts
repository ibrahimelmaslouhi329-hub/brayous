export const product = {
  name: 'product',
  title: 'الموديلات (الملابس)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'اسم الموديل (مثلاً: جاكيط صوف حمراء)',
      type: 'string',
    },
    {
      name: 'price',
      title: 'الثمن (DH)',
      type: 'number',
    },
    {
      name: 'image',
      title: 'الصورة الأساسية للموديل',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'description',
      title: 'وصف الملابس (القماش، المقاسات المتوفرة، الجودة)',
      type: 'text',
    },
    {
      name: 'additionalImages',
      title: 'صور إضافية للموديل (من زوايا مختلفة)',
      type: 'array',
      of: [{ type: 'image' }],
    }
  ]
}