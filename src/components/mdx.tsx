import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { LocalizedCard, LocalizedCards, LocalizedLink } from './localized-link';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Step,
    Steps,
    // Content is authored with absolute /docs/... hrefs; these wrappers
    // prefix the current locale since neither Link nor Card do it on their
    // own (see src/components/localized-link.tsx).
    a: LocalizedLink,
    Card: LocalizedCard,
    Cards: LocalizedCards,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
