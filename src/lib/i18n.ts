import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'pt', 'es'],
  // Every locale keeps its prefix (/en, /pt, /es) — this site is a static
  // export (GitHub Pages, no server), and hideLocale's 'default-locale'/
  // 'always' modes rely on NextResponse.rewrite, which needs Middleware.
  hideLocale: 'never',
});
