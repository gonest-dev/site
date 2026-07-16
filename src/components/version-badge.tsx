'use client';

import { useEffect, useState } from 'react';
import { frameworkRepo } from '@/lib/shared';

// The site is a static export (next.config.mjs's `output: 'export'`) --
// there is no server at request time to fetch this at render time, so it
// runs client-side on mount instead. That is actually the better fit for
// "reflects the latest release dynamically": a rebuild isn't needed for
// this badge to pick up a new tag, only a page load.
export function VersionBadge() {
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${frameworkRepo.user}/${frameworkRepo.repo}/releases/latest`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { tag_name?: string } | null) => {
        if (!cancelled && data?.tag_name) setTag(data.tag_name);
      })
      .catch(() => {
        // No release yet, or api.github.com unreachable/rate-limited --
        // fail silently, the badge just doesn't render (see below).
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!tag) return null;

  return (
    <a
      href={`https://github.com/${frameworkRepo.user}/${frameworkRepo.repo}/releases/tag/${tag}`}
      className="w-fit rounded-full border border-fd-border bg-fd-secondary px-3 py-1 text-xs font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent"
    >
      {tag}
    </a>
  );
}
