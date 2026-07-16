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

const quickstart = `package main

import "github.com/gonest-dev/gonest"

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
  app := gonest.MustNewApp[gonest.FiberApp](UserModule, gonest.AppOptions{})
  app.MustListen(":3000")
}`;

const capabilities: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}[] = [
  { icon: Box, title: 'Dependency Injection', description: 'Modules, providers, and 3 DI scopes.', href: '/docs/core-concepts' },
  { icon: Workflow, title: 'Request Pipeline', description: 'Middleware, guards, interceptors, filters.', href: '/docs/request-pipeline' },
  { icon: ShieldCheck, title: 'Validation & Schemas', description: 'Type-safe builders via generics, no struct tags.', href: '/docs/validation' },
  { icon: Upload, title: 'Multipart Streaming', description: 'True streaming file uploads, no buffering.', href: '/docs/multipart' },
  { icon: FileJson, title: 'OpenAPI & Swagger', description: 'Generate docs from the same schemas that validate.', href: '/docs/openapi' },
  { icon: Radio, title: 'Event Emitter', description: 'Typed, fire-and-forget events between providers.', href: '/docs/emitter' },
  { icon: Clock, title: 'Scheduler', description: 'Cron, interval, and timeout jobs.', href: '/docs/scheduler' },
  { icon: HeartPulse, title: 'Health Checks', description: 'Terminus-style readiness and liveness routes.', href: '/docs/health-checks' },
  { icon: FlaskConical, title: 'Testing', description: 'In-memory bootstrap, provider overrides, assertions.', href: '/docs/testing' },
  { icon: Fingerprint, title: 'Type-safe Builders', description: 'Fields identified by pointer, not string tags.', href: '/docs/validation' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="relative overflow-hidden border-b border-fd-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, hsla(158, 64%, 45%, 0.25), transparent 45%)',
          }}
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-start lg:py-28">
          <div className="flex flex-col gap-6">
            <span className="w-fit rounded-full border border-fd-border bg-fd-secondary px-3 py-1 text-xs font-medium text-fd-secondary-foreground">
              NestJS-inspired, built for Go
            </span>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              gonest
              <span className="block text-fd-muted-foreground">
                dependency injection for Go, done right.
              </span>
            </h1>
            <p className="max-w-lg text-lg text-fd-muted-foreground">
              Modules, providers, controllers, and a full request pipeline —
              the developer experience NestJS gives Node/TypeScript, without
              giving up idiomatic Go.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs"
                className="rounded-md bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                href="https://github.com/gonest-dev/gonest"
                className="rounded-md border border-fd-border px-5 py-2.5 font-medium transition-colors hover:bg-fd-secondary"
              >
                View on GitHub
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
        <h2 className="mb-8 text-center text-2xl font-semibold">
          Everything a NestJS developer expects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {capabilities.map(({ icon: Icon, title, description, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col gap-3 rounded-lg border border-fd-border bg-fd-card p-5 transition-colors hover:border-fd-primary/40 hover:bg-fd-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-fd-accent text-fd-accent-foreground">
                <Icon className="size-5" />
              </span>
              <span className="font-medium">{title}</span>
              <span className="text-sm text-fd-muted-foreground">{description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
