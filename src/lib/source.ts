import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { i18n } from './i18n';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  i18n,
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    // The route lives under /[lang]/og/docs/... (see src/app/[lang]/og/docs) --
    // segments themselves stay locale-free (that's what generateStaticParams'
    // own `slug` param expects, with `lang` passed separately), but the
    // browser-facing url must carry the locale prefix explicitly since
    // hideLocale is 'never' (i18n.ts) and there's no middleware/rewrite here
    // (static export) to fill it in otherwise.
    url: `/${page.locale}${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    // Same locale-prefix requirement as getPageImage above -- the route is
    // /[lang]/llms.mdx/docs/... (src/app/[lang]/llms.mdx/docs).
    url: `/${page.locale}${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
