import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CursorSpotlight } from "@/components/cursor-spotlight";
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
    <div className="min-h-screen bg-black px-4 py-16 text-white transition-colors md:px-10">
      <CursorSpotlight />
      <div className="mx-auto max-w-5xl space-y-10">
        <Link
          href="/#projects"
          className="inline-flex items-center text-sm text-zinc-400 transition hover:text-teal-200"
        >
          ← Back to portfolio
        </Link>

        <header className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-teal-300">
            {project.timeframe}
          </p>
          <h1 className="text-4xl font-semibold text-white">{project.name}</h1>
          <p className="text-lg text-zinc-200">{project.tagline}</p>
          <div className="flex flex-wrap gap-3 text-xs text-teal-200">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-teal-300/40 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/5 shadow-[0_35px_120px_-45px_rgba(20,184,166,0.8)]">
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

        <section className="grid gap-6 md:grid-cols-3">
          <div className="group rounded-[36px] border border-white/5 bg-white/5 p-8 text-white backdrop-blur transition hover:border-teal-300/50 hover:bg-white/10 dark:bg-black/30">
            <h2 className="text-sm uppercase tracking-[0.3em] text-teal-300">Problem</h2>
            <p className="mt-4 text-sm text-zinc-200">{project.problem}</p>
          </div>
          <div className="group rounded-[36px] border border-white/5 bg-white/5 p-8 text-white backdrop-blur transition hover:border-teal-300/50 hover:bg-white/10 dark:bg-black/30">
            <h2 className="text-sm uppercase tracking-[0.3em] text-teal-300">Approach</h2>
            <p className="mt-4 text-sm text-zinc-200">{project.approach}</p>
          </div>
          <div className="group rounded-[36px] border border-white/5 bg-white/5 p-8 text-white backdrop-blur transition hover:border-teal-300/50 hover:bg-white/10 dark:bg-black/30">
            <h2 className="text-sm uppercase tracking-[0.3em] text-teal-300">Impact</h2>
            <p className="mt-4 text-sm text-zinc-200">{project.impact}</p>
          </div>
        </section>

        <section className="group space-y-4 rounded-[36px] border border-white/5 bg-white/5 p-8 text-white backdrop-blur transition hover:border-teal-300/50 hover:bg-white/10 dark:bg-black/30">
          <h2 className="text-sm uppercase tracking-[0.3em] text-teal-300">Highlights</h2>
          <ul className="space-y-3 text-sm text-zinc-200">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-300" />
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
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white transition hover:border-teal-400/60"
            >
              {link.label} ↗
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
