import client from '../client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const clientConfig = client.config();
const config = {
  ...clientConfig,
  projectId: clientConfig.projectId || 'default', // We'll assume we'll always have the project ID set in the client config...
  dataset: clientConfig.dataset || 'production',
  baseUrl: 'https://cdn.sanity.io',
};

const builder = imageUrlBuilder(config);

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export default urlFor;