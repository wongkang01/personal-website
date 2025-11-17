"use client";

import Link from "next/link";
import Image from "next/image";
import { Project } from "@/content/data";
import clsx from "clsx";
import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

type ProjectsSectionProps = {
  projects: Project[];
  tags: string[];
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
};

export function ProjectsSection({
  projects,
  tags,
  selectedTag,
  onTagChange,
  searchTerm,
  onSearchTermChange,
}: ProjectsSectionProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const toggleCard = (slug: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <section id="projects" className="space-y-10">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.5em] text-teal-300">Projects</p>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Case studies with their own storytelling space
        </h2>
        <p className="max-w-3xl text-base text-zinc-400">
          These builds explore how I layer research, UX writing, and resilient engineering. Each card
          opens into its own narrative with highlights, stack, and impact.
        </p>
      </div>

      <div
        className={clsx(
          "rounded-[32px] border border-white/5 bg-gradient-to-r from-white/5 via-transparent to-white/10 transition-all shadow-[0_25px_80px_-40px_rgba(15,118,110,0.8)] backdrop-blur dark:from-black/40 dark:to-black/10",
          filterPanelOpen ? "p-6" : "p-3"
        )}
      >
        {filterPanelOpen ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                Search projects
              </p>
              <button
                type="button"
                onClick={() => setFilterPanelOpen(false)}
                className="text-xs font-semibold uppercase tracking-wide text-teal-300 hover:text-white"
              >
                Collapse
              </button>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
                placeholder="Search by project name, stack, or impact"
                className="h-14 w-full rounded-2xl border border-white/15 bg-black/30 pl-11 pr-5 text-base text-white placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label="All"
                active={!selectedTag}
                onClick={() => onTagChange(null)}
              />
              {tags.map((tag) => (
                <FilterChip
                  key={tag}
                  label={tag}
                  active={selectedTag === tag}
                  onClick={() => onTagChange(tag)}
                />
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setFilterPanelOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-left text-sm text-zinc-400 transition hover:border-teal-400/60 hover:text-white"
          >
            <span>Search by project name, stack, or impact</span>
            <Search size={16} />
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-400">
          No projects match that filter yet. Try another tag or clear your search.
        </p>
      ) : (
        <div className="space-y-10">
          {projects.map((project) => {
            const isExpanded = expandedCards.has(project.slug);
            return (
              <article
                key={project.slug}
                className="project-card group flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/5 via-black/10 to-black/30 text-white shadow-[0_35px_120px_-45px_rgba(20,184,166,0.8)] transition-transform duration-500 hover:-translate-y-2 hover:border-teal-400/60"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={project.heroImage}
                    alt={project.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 space-y-1">
                    <p className="text-xs uppercase tracking-wide text-teal-200">
                      {project.timeframe}
                    </p>
                    <h3 className="text-2xl font-semibold text-white">
                      {project.name}
                    </h3>
                    <p className="text-sm text-zinc-200">{project.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Focus</p>
                  <p className="text-base leading-relaxed text-zinc-200">
                    {project.description}
                  </p>

                  <div
                    className={clsx(
                      "grid overflow-hidden transition-all duration-500",
                      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                    aria-hidden={!isExpanded}
                  >
                    <div className="min-h-0 space-y-4">
                      <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-400">
                        {project.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 text-xs text-teal-200">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-teal-300/40 px-3 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-teal-400/60"
                        >
                          Case study ↗
                        </Link>
                        {project.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCard(project.slug)}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-teal-200 transition hover:text-white"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Show less" : "Show more"}
                    <ChevronDown
                      size={18}
                      className={clsx("transition", isExpanded && "rotate-180")}
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide",
        active
          ? "bg-teal-400/20 text-teal-200"
          : "bg-white/5 text-zinc-400 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}
