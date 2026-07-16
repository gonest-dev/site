import Link from 'next/link';
import { author } from '@/lib/shared';
import { getHomeDictionary } from '@/lib/home-dictionary';

export function Footer({ lang }: { lang: string }) {
  const t = getHomeDictionary(lang);

  return (
    <footer className="border-t border-fd-border py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-6 text-center text-sm text-fd-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <span>{t.footerLicenseNote}</span>
        <span>
          {t.footerCreatedBy}{' '}
          <Link
            href={author.githubUrl}
            className="font-medium text-fd-foreground underline underline-offset-4"
          >
            @{author.name}
          </Link>
        </span>
      </div>
    </footer>
  );
}
