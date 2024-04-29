import {defineField, defineType} from 'sanity'

export const gordoType = defineType({
  name: 'gordo',
  title: 'Gordo',
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
      name: 'favouritefood',
      title: 'Favourite Food',
      type: 'reference',
      to: [{type: 'food'}],
    }),
    defineField({
      name: 'latitude',
      type: 'string',
    }),
    defineField({
      name: 'longitude',
      type: 'string',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
})