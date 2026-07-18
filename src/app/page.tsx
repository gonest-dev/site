'use client';

import { useLayoutEffect } from 'react';
import { i18n } from '@/lib/i18n';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function RootRedirect() {
  useLayoutEffect(() => {
    const supported = new Set<string>(i18n.languages);
    const browserLanguages = navigator.languages ?? [navigator.language];

    let target: string = i18n.defaultLanguage;
    for (const tag of browserLanguages) {
      const code = tag.split('-')[0].toLowerCase();
      if (supported.has(code)) {
        target = code;
        break;
      }
    }

    window.location.replace(`${basePath}/${target}/`);
  }, []);

  return null;
}
