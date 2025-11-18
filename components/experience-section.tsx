import Image from "next/image";
import { Experience } from "@/content/data";

type ExperienceSectionProps = {
  experiences: Experience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      data-section="experience"
      className="flex min-h-screen flex-col justify-center space-y-10 py-16"
    >
      <div className="space-y-4" data-exp-heading>
        <p className="text-xs uppercase tracking-[0.5em] text-teal-300">Experience</p>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Building data-informed systems in production
        </h2>
        <p className="max-w-3xl text-base text-zinc-400">
          Rotating through AI labs and infra-heavy teams taught me how to move from exploratory
          research to resilient products. Every engagement below paired messy data with calm
          experiences powered by automation.
        </p>
      </div>
      <div className="space-y-8" data-exp-list>
        {experiences.map((exp) => (
          <article
            key={exp.id}
            data-exp-card
            className="group rounded-[36px] border border-white/5 bg-white/5 p-8 text-white backdrop-blur transition hover:border-teal-300/50 hover:bg-white/10 dark:bg-black/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {exp.logo && (
                  <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
                    <Image
                      src={exp.logo.src}
                      alt={exp.logo.alt}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-zinc-400">{exp.company}</p>
                </div>
              </div>
              <span className="text-xs uppercase tracking-wide text-zinc-500">
                {exp.timeframe}
              </span>
            </div>
            <p className="mt-4 text-base text-zinc-300">{exp.summary}</p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              {exp.highlights.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-1 h-1 w-1 rounded-full bg-teal-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {exp.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
