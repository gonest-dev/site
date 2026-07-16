export interface HomeCapability {
  title: string;
  description: string;
}

export interface HomeDictionary {
  badge: string;
  heroTagline: string;
  heroSubtitle: string;
  ctaGetStarted: string;
  ctaGithub: string;
  capabilitiesSectionTitle: string;
  capabilities: HomeCapability[];
  footerLicenseNote: string;
  footerCreatedBy: string;
}

// Capability order/hrefs are fixed (see app/[lang]/(home)/page.tsx); only
// title/description are localized here.
const en: HomeDictionary = {
  badge: 'NestJS-inspired, built for Go',
  heroTagline: 'dependency injection for Go, done right.',
  heroSubtitle:
    'Modules, providers, controllers, and a full request pipeline — the developer experience NestJS gives Node/TypeScript, without giving up idiomatic Go.',
  ctaGetStarted: 'Get Started',
  ctaGithub: 'View on GitHub',
  capabilitiesSectionTitle: 'Everything a NestJS developer expects',
  capabilities: [
    { title: 'Dependency Injection', description: 'Modules, providers, and 3 DI scopes.' },
    { title: 'Request Pipeline', description: 'Middleware, guards, interceptors, filters.' },
    { title: 'Validation & Schemas', description: 'Type-safe builders via generics, no struct tags.' },
    { title: 'Multipart Streaming', description: 'True streaming file uploads, no buffering.' },
    { title: 'OpenAPI & Swagger', description: 'Generate docs from the same schemas that validate.' },
    { title: 'Event Emitter', description: 'Typed, fire-and-forget events between providers.' },
    { title: 'Scheduler', description: 'Cron, interval, and timeout jobs.' },
    { title: 'Health Checks', description: 'Terminus-style readiness and liveness routes.' },
    { title: 'Testing', description: 'In-memory bootstrap, provider overrides, assertions.' },
    { title: 'Type-safe Builders', description: 'Fields identified by pointer, not string tags.' },
  ],
  footerLicenseNote: 'gonest is open source, released under no license yet.',
  footerCreatedBy: 'Created by',
};

// Filled in by later tasks (T10, T11); default to English until translated.
const pt: HomeDictionary = en;
const es: HomeDictionary = en;

const dictionaries: Record<string, HomeDictionary> = { en, pt, es };

export function getHomeDictionary(lang: string): HomeDictionary {
  return dictionaries[lang] ?? en;
}
