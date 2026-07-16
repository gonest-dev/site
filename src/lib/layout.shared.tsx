import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, frameworkRepo } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: `https://github.com/${frameworkRepo.user}/${frameworkRepo.repo}`,
  };
}
