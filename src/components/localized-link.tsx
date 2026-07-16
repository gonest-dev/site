'use client';

import Link from 'fumadocs-core/link';
import { Card as BaseCard, Cards } from 'fumadocs-ui/components/card';
import { useParams } from 'next/navigation';
import type { ComponentProps } from 'react';

/**
 * Content is authored with absolute `/docs/...` hrefs (predates i18n), and
 * neither fumadocs-core's Link nor its Card component prefix those with the
 * current locale on their own. Prepend it once here instead of rewriting
 * every link in every MDX file to a relative path.
 */
function withLocale(href: string | undefined, lang: string | undefined): string | undefined {
  if (!href || !lang) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('#')) {
    return href;
  }
  if (href === `/${lang}` || href.startsWith(`/${lang}/`)) return href;
  if (href.startsWith('/')) return `/${lang}${href}`;
  return href;
}

function useLang(): string | undefined {
  const params = useParams<{ lang?: string }>();
  return params.lang;
}

export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  const lang = useLang();
  return <Link href={withLocale(href, lang)} {...props} />;
}

export function LocalizedCard(props: ComponentProps<typeof BaseCard>) {
  const lang = useLang();
  return <BaseCard {...props} href={withLocale(props.href, lang)} />;
}

export { Cards as LocalizedCards };
