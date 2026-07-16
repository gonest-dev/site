import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Static export (GitHub Pages) has no server to run search queries against,
// so the index is pre-rendered at build time and served as a static file
// instead. Since `source` is i18n-aware, this produces ONE combined file
// containing every locale's index; the client (src/components/search.tsx)
// picks the right locale's sub-index at query time via `oramaStaticClient`.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  localeMap: {
    en: 'english',
    pt: 'portuguese',
    es: 'spanish',
  },
});
