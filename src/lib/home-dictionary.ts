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
    'Modules, providers, controllers, and a full request pipeline — ' +
    'the developer experience NestJS gives Node/TypeScript, without giving up idiomatic Go.',
  ctaGetStarted: 'Get Started',
  ctaGithub: 'View on GitHub',
  capabilitiesSectionTitle: 'Everything a NestJS developer expects',
  capabilities: [
    { title: 'Dependency Injection', description: 'Modules, providers, and 3 DI scopes.' },
    { title: 'Request Pipeline', description: 'Middleware, guards, interceptors, filters.' },
    { title: 'Validation & Schemas', description: 'Type-safe builders via generics, no struct tags.' },
    { title: 'Multipart Streaming', description: 'True streaming file uploads, no buffering.' },
    { title: 'OpenAPI & Swagger', description: 'Generate docs from the same schemas that validate.' },
    { title: 'Emitter', description: 'Typed, fire-and-forget events between providers.' },
    { title: 'Scheduler', description: 'Cron, interval, and timeout jobs.' },
    { title: 'Health Checks', description: 'Terminus-style readiness and liveness routes.' },
    { title: 'Testing', description: 'In-memory bootstrap, provider overrides, assertions.' },
    { title: 'Type-safe Builders', description: 'Fields identified by pointer, not string tags.' },
  ],
  footerLicenseNote: 'gonest is open source, released under the MIT license.',
  footerCreatedBy: 'Created by',
};

const pt: HomeDictionary = {
  badge: 'Inspirado no NestJS, feito para Go',
  heroTagline: 'injeção de dependência para Go, do jeito certo.',
  heroSubtitle:
    'Módulos, provedores, controladores e um pipeline de requisição completo — a experiência de desenvolvimento que o NestJS oferece ao Node/TypeScript, sem abrir mão do Go idiomático.',
  ctaGetStarted: 'Começar',
  ctaGithub: 'Ver no GitHub',
  capabilitiesSectionTitle: 'Tudo que um desenvolvedor NestJS espera encontrar',
  capabilities: [
    { title: 'Injeção de Dependência', description: 'Módulos, provedores e 3 escopos de DI.' },
    { title: 'Pipeline de Requisição', description: 'Middleware, guards, interceptors, filters.' },
    { title: 'Validação & Schemas', description: 'Builders type-safe via generics, sem struct tags.' },
    { title: 'Streaming de Multipart', description: 'Upload de arquivos com streaming real, sem buffer.' },
    { title: 'OpenAPI & Swagger', description: 'Gera documentação a partir dos mesmos schemas que validam.' },
    { title: 'Emitter', description: 'Eventos tipados, fire-and-forget entre provedores.' },
    { title: 'Scheduler', description: 'Jobs de cron, interval e timeout.' },
    { title: 'Health Checks', description: 'Rotas de readiness e liveness no estilo Terminus.' },
    { title: 'Testing', description: 'Bootstrap em memória, overrides de provider, assertions.' },
    { title: 'Builders Type-safe', description: 'Campos identificados por ponteiro, não por string tags.' },
  ],
  footerLicenseNote: 'gonest é open source, distribuído sob a licença MIT.',
  footerCreatedBy: 'Criado por',
};

const es: HomeDictionary = {
  badge: 'Inspirado en NestJS, hecho para Go',
  heroTagline: 'inyección de dependencias para Go, como debe ser.',
  heroSubtitle:
    'Módulos, proveedores, controladores y un pipeline de peticiones completo — la experiencia de desarrollo que NestJS le da a Node/TypeScript, sin renunciar a un Go idiomático.',
  ctaGetStarted: 'Comenzar',
  ctaGithub: 'Ver en GitHub',
  capabilitiesSectionTitle: 'Todo lo que un desarrollador de NestJS espera encontrar',
  capabilities: [
    { title: 'Inyección de Dependencias', description: 'Módulos, proveedores y 3 alcances de DI.' },
    { title: 'Pipeline de Peticiones', description: 'Middleware, guards, interceptors, filters.' },
    { title: 'Validación y Schemas', description: 'Builders type-safe mediante generics, sin struct tags.' },
    { title: 'Streaming Multipart', description: 'Subida de archivos con streaming real, sin buffer.' },
    { title: 'OpenAPI y Swagger', description: 'Genera documentación a partir de los mismos schemas que validan.' },
    { title: 'Emitter', description: 'Eventos tipados, fire-and-forget entre proveedores.' },
    { title: 'Scheduler', description: 'Tareas de cron, interval y timeout.' },
    { title: 'Health Checks', description: 'Rutas de readiness y liveness al estilo Terminus.' },
    { title: 'Testing', description: 'Bootstrap en memoria, overrides de provider, assertions.' },
    { title: 'Builders Type-safe', description: 'Campos identificados por puntero, no por string tags.' },
  ],
  footerLicenseNote: 'gonest es open source, distribuido bajo la licencia MIT.',
  footerCreatedBy: 'Creado por',
};

const dictionaries: Record<string, HomeDictionary> = { en, pt, es };

export function getHomeDictionary(lang: string): HomeDictionary {
  return dictionaries[lang] ?? en;
}
