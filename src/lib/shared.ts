export const appName = 'Gonest';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// Repo backing this docs site itself — used for "edit this page" links,
// since content/docs lives here, not in the gonest framework repo.
export const gitConfig = {
  user: 'gonest-dev',
  repo: 'site',
  branch: 'main',
};

// The gonest framework's own repo — used for the top-nav GitHub icon and
// hero "View on GitHub" button, since that's the source visitors want.
export const frameworkRepo = {
  user: 'gonest-dev',
  repo: 'gonest',
};

export const author = {
  name: 'leandroluk',
  githubUrl: 'https://github.com/leandroluk',
};
