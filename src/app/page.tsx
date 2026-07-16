'use client';

import { useEffect } from 'react';
import { i18n } from '@/lib/i18n';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function RootRedirect() {
  useEffect(() => {
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

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-fd-muted-foreground">Redirecting…</p>
      <a href={`${basePath}/en/`} className="font-medium underline underline-offset-4">
        Continue in English
      </a>
    </div>
  );
}
