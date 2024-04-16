import {defineField, defineType} from 'sanity'

export const gadgetType = defineType({
  name: 'gadget',
  title: 'Gadget',
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