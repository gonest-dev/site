import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center flex-1 px-6 py-24 gap-6">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">gonest</h1>
      <p className="max-w-xl text-fd-muted-foreground text-lg">
        Placeholder pitch — replaced with final copy in the next task.
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
    </div>
  );
}
