import {defineField, defineType} from 'sanity'

export const resourceType = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      type: 'image',
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