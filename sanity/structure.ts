import type {StructureBuilder} from 'sanity/structure'

export const structure: (S: StructureBuilder) => ReturnType<StructureBuilder['list']> = (S) =>
  S.list()
    .title('محتوى المتجر')
    .items([
      S.documentTypeListItem('product').title('الملابس'),
    ])