import {defineField, defineType} from 'sanity'

export const buildingType = defineType({
  name: 'building',
  title: 'Building',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      type: 'image',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
})