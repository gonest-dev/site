import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Static export (GitHub Pages) has no server to run search queries against,
// so the index is pre-rendered at build time and served as a static file
// instead. See src/components/search.tsx for the matching client.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});
