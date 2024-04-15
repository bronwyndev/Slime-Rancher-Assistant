import {defineField, defineType} from 'sanity'

export const slimeType = defineType({
  name: 'slime',
  title: 'Slime',
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
  ],
})