import Link from 'next/link';
import { author } from '@/lib/shared';

export function Footer() {
  return (
    <footer className="border-t border-fd-border py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-6 text-center text-sm text-fd-muted-foreground sm:flex-row sm:justify-between sm:text-left">
        <span>gonest is open source, released under no license yet.</span>
        <span>
          Created by{' '}
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
