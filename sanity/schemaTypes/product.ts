export const product = {
    name: 'product',
    title: 'المنتجات',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'اسم المنتج',
        type: 'string',
      },
      {
        name: 'price',
        title: 'الثمن (DH)',
        type: 'number',
      },
      {
        name: 'category',
        title: 'الصنف',
        type: 'string',
        options: {
          list: [
            { title: 'ملابس رجال', value: 'ملابس رجال' },
            { title: 'سراول', value: 'سراول' },
            { title: 'كاسكيطات', value: 'كاسكيطات' },
            { title: 'سبرديلات', value: 'سبرديلات' },
          ],
        },
      },
      {
        name: 'image',
        title: 'صورة المنتج',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'description',
        title: 'وصف المنتج',
        type: 'text',
      },
    ],
  }