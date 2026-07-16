import Link from 'next/link';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import {
  Box,
  Workflow,
  ShieldCheck,
  Upload,
  FileJson,
  Radio,
  Clock,
  HeartPulse,
  FlaskConical,
  Fingerprint,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { getHomeDictionary } from '@/lib/home-dictionary';
import { VersionBadge } from '@/components/version-badge';

const quickstart = `package main

import "gonest.dev/gonest"

type UserService struct{}

func (s *UserService) List() []string { return []string{"Ada", "Grace"} }

var UserProvider = gonest.NewProvider(func(provider *gonest.Provider) {
  provider.Constructor(func() *UserService { return &UserService{} })
})

var UserController = gonest.NewController(func(controller *gonest.Controller) {
  controller.Path("/users")
  userService := gonest.MustInject[*UserService](controller)

  controller.RouteGet("/", func(route *gonest.Route) {
    route.Handler(func(ctx *gonest.RestContext) {
      ctx.Json(userService.List())
    })
  })
})

var UserModule = gonest.NewModule(func(module *gonest.Module) {
  module.Providers(UserProvider)
  module.Controllers(UserController)
})

func main() {
  app := gonest.MustNewApp[gonest.FiberApp](UserModule) // AppOptions is optional
  app.MustListen(":3000")
}`;

const capabilityIcons: { icon: ComponentType<{ className?: string }>; href: string }[] = [
  { icon: Box, href: '/docs/core-concepts' },
  { icon: Workflow, href: '/docs/request-pipeline' },
  { icon: ShieldCheck, href: '/docs/validation' },
  { icon: Upload, href: '/docs/multipart' },
  { icon: FileJson, href: '/docs/openapi' },
  { icon: Radio, href: '/docs/emitter' },
  { icon: Clock, href: '/docs/scheduler' },
  { icon: HeartPulse, href: '/docs/health-checks' },
  { icon: FlaskConical, href: '/docs/testing' },
  { icon: Fingerprint, href: '/docs/validation' },
];

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const t = getHomeDictionary(lang);

  return (
    <div className="flex flex-col flex-1">
      <section className="relative overflow-hidden border-b border-fd-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, hsla(187, 81%, 41%, 0.22), transparent 45%), radial-gradient(circle at 85% 75%, hsla(347, 75%, 56%, 0.1), transparent 40%)',
          }}
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-start lg:py-28">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-fit rounded-full border border-fd-border bg-fd-secondary px-3 py-1 text-xs font-medium text-fd-secondary-foreground">
                {t.badge}
              </span>
              <VersionBadge />
            </div>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              gonest
              <span className="block text-fd-muted-foreground">{t.heroTagline}</span>
            </h1>
            <p className="max-w-lg text-lg text-fd-muted-foreground">{t.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${lang}/docs`}
                className="rounded-md bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                {t.ctaGetStarted}
              </Link>
              <Link
                href="https://github.com/gonest-dev/gonest"
                className="rounded-md border border-fd-border px-5 py-2.5 font-medium transition-colors hover:bg-fd-secondary"
              >
                {t.ctaGithub}
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-fd-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-red-500/70" />
              <span className="size-2.5 rounded-full bg-yellow-500/70" />
              <span className="size-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-fd-muted-foreground">main.go</span>
            </div>
            <div className="max-h-[420px] overflow-y-auto text-left text-xs leading-relaxed [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!py-4">
              <DynamicCodeBlock lang="go" code={quickstart} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">{t.capabilitiesSectionTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {capabilityIcons.map(({ icon: Icon, href }, i) => {
            const capability = t.capabilities[i];
            return (
              <Link
                key={capability.title}
                href={`/${lang}${href}`}
                className="group flex flex-col gap-3 rounded-lg border border-fd-border bg-fd-card p-5 transition-colors hover:border-fd-primary/40 hover:bg-fd-accent"
              >
                <span className="flex size-9 items-center justify-center rounded-md bg-fd-accent text-fd-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="font-medium">{capability.title}</span>
                <span className="text-sm text-fd-muted-foreground">{capability.description}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
