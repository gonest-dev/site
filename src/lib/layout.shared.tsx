import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { frameworkRepo } from './shared';
import Image from 'next/image';

// Matches the gonest logo's own wordmark styling ("go" teal / "nest" pink)
// and the icon extracted from it for the favicon (src/app/icon.png) -- see
// STATE.md's brand-colors note in the gonest repo for where the palette
// (teal #14A9BE, pink #E33B5F) came from.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

function NavTitle() {
  return (
    <span className="flex items-center gap-2 font-semibold">
      <Image src={`${basePath}/logo-icon.png`} alt="" width={22} height={22} className="size-5.5" />
      <span>
        <span className="text-fd-primary">go</span>
        <span className="text-[#E33B5F]">nest</span>
      </span>
    </span>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: <NavTitle />,
    },
    githubUrl: `https://github.com/${frameworkRepo.user}/${frameworkRepo.repo}`,
  };
}
