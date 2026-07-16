import Link from 'next/link';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Card, Cards } from 'fumadocs-ui/components/card';

const capabilities = [
  { title: 'Dependency Injection', description: 'Modules, providers, and 3 DI scopes.', href: '/docs/core-concepts' },
  { title: 'Request Pipeline', description: 'Middleware, guards, interceptors, filters.', href: '/docs/request-pipeline' },
  { title: 'Validation & Schemas', description: 'Type-safe builders via generics, no struct tags.', href: '/docs/validation' },
  { title: 'Multipart Streaming', description: 'True streaming file uploads, no buffering.', href: '/docs/multipart' },
  { title: 'OpenAPI & Swagger', description: 'Generate docs from the same schemas that validate.', href: '/docs/openapi' },
  { title: 'Event Emitter', description: 'Typed, fire-and-forget events between providers.', href: '/docs/emitter' },
  { title: 'Scheduler', description: 'Cron, interval, and timeout jobs.', href: '/docs/scheduler' },
  { title: 'Health Checks', description: 'Terminus-style readiness and liveness routes.', href: '/docs/health-checks' },
  { title: 'Testing', description: 'In-memory bootstrap, provider overrides, assertions.', href: '/docs/testing' },
  { title: 'Type-safe Builders', description: 'Fields identified by pointer, not string tags.', href: '/docs/validation' },
];

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

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center flex-1 px-6 py-24 gap-6">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">gonest</h1>
      <p className="max-w-xl text-fd-muted-foreground text-lg">
        A NestJS-inspired dependency-injection and HTTP framework for Go — modules, providers,
        controllers, and a full request pipeline, without giving up idiomatic Go.
      </p>
      <div className="flex gap-3">
        <Link
          href="/docs"
          className="rounded-md bg-fd-primary text-fd-primary-foreground px-5 py-2.5 font-medium"
        >
          Get Started
        </Link>
        <Link
          href="https://github.com/gonest-dev/gonest"
          className="rounded-md border border-fd-border px-5 py-2.5 font-medium"
        >
          GitHub
        </Link>
      </div>
      <div className="w-full max-w-2xl text-left mt-4">
        <DynamicCodeBlock lang="go" code={quickstart} />
      </div>
      <Cards className="w-full max-w-4xl text-left mt-12">
        {capabilities.map((c) => (
          <Card key={c.title} title={c.title} description={c.description} href={c.href} />
        ))}
      </Cards>
    </div>
  );
}
