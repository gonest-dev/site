import type { Metadata } from 'next';
import { frameworkRepo } from '@/lib/shared';

// Go's vanity import path support: `import "gonest.dev/gonest"` only works
// because the go tool, when given a path it doesn't recognize as a known
// code host, GETs `https://<import-path>?go-get=1` and looks for a
// `<meta name="go-import">` tag in the response HTML. This page is that
// response -- it must be served at the EXACT import path
// (gonest.dev/gonest, i.e. this site's root domain + /gonest), matching
// what gonest/go.mod declares as its `module` directive (module path and
// this page's URL must be identical, or `go get` fails with a "declares
// its path as X but was required as Y" error). See STATE.md's Current Work
// (vanity import) note in the gonest repo for the full rationale.
const importPath = 'gonest.dev/gonest';
const repoUrl = `https://github.com/${frameworkRepo.user}/${frameworkRepo.repo}`;

export const metadata: Metadata = {
  title: importPath,
  other: {
    'go-import': `${importPath} git ${repoUrl}`,
    'go-source': `${importPath} _ ${repoUrl}/tree/main{/dir} ${repoUrl}/blob/main{/dir}/{file}#L{line}`,
  },
};

export default function GonestVanityImportPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="font-mono text-sm text-fd-muted-foreground">go get {importPath}</p>
      <a href={`https://pkg.go.dev/${importPath}`} className="font-medium underline underline-offset-4">
        View on pkg.go.dev
      </a>
    </div>
  );
}
