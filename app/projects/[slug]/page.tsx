import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/data";

type ProjectRouteParams = {
  slug: string;
};

type ProjectPageProps = {
  params: Promise<ProjectRouteParams>;
};

export function generateStaticParams(): ProjectRouteParams[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${project.name} · Wong Kang`,
    description: project.tagline,
    openGraph: {
      title: project.name,
      description: project.description,
      images: [{ url: project.heroImage }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug) ?? notFound();

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-16 text-[var(--foreground)] transition-colors md:px-10">
      <div className="mx-auto max-w-5xl space-y-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-500 transition hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-200"
        >
          ← Back to portfolio
        </Link>

        <header className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-teal-600 dark:text-teal-300">
            {project.timeframe}
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">{project.name}</h1>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">{project.tagline}</p>
          <div className="flex flex-wrap gap-3 text-xs text-teal-700 dark:text-teal-200">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-teal-500/30 px-3 py-1 dark:border-teal-400/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-white/10">
          <Image
            src={project.heroImage ?? "/images/profile_img.jpg"}
            alt={project.name ?? "Project"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-black/40" />
        </div>

        <section className="grid gap-6 rounded-3xl border border-zinc-200/80 bg-white/80 p-8 text-slate-900 backdrop-blur-sm dark:border-white/10 dark:bg-black/30 dark:text-white md:grid-cols-3">
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-teal-600 dark:text-teal-300">Problem</h2>
            <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{project.problem}</p>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-teal-600 dark:text-teal-300">Approach</h2>
            <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{project.approach}</p>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-teal-600 dark:text-teal-300">Impact</h2>
            <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{project.impact}</p>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white/80 p-8 text-slate-900 dark:border-white/10 dark:bg-gradient-to-br dark:from-white/5 dark:to-black/30 dark:text-white">
          <h2 className="text-sm uppercase tracking-[0.3em] text-teal-600 dark:text-teal-300">Highlights</h2>
          <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-600 dark:bg-teal-300" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-wrap gap-3">
          {project.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 px-5 py-3 text-sm text-slate-900 transition hover:border-teal-400/60 dark:border-white/10 dark:text-white"
            >
              {link.label} ↗
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
