import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {media} from 'sanity-plugin-media'
import {documentInternationalization} from '@sanity/document-internationalization'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'

const devOnlyPlugins = [getStartedPlugin()]

export default defineConfig({
  name: 'default',
  title: 'Slime Rancher Assistant',

  projectId: '9yc4oudn',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(), 
    media(), 
    ...(isDev ? devOnlyPlugins : []),
    documentInternationalization({
      // Required configuration
      supportedLanguages: [
        {id: 'es', title: 'Spanish'},
        {id: 'en', title: 'English'}
      ],
      schemaTypes: ['slime', 'food'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

