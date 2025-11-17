"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AboutSection } from "./about-section";
import { ExperienceSection } from "./experience-section";
import { ProjectsSection } from "./projects-section";
import { NavSidebar } from "./nav-sidebar";
import { CursorSpotlight } from "./cursor-spotlight";
import { Experience, Project, SocialLink } from "@/content/data";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

type PortfolioPageProps = {
  experiences: Experience[];
  projects: Project[];
  socialLinks: SocialLink[];
};

gsap.registerPlugin(ScrollTrigger);

export function PortfolioPage({ experiences, projects, socialLinks }: PortfolioPageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const sectionVisibility = useRef<Record<string, number>>(
    SECTIONS.reduce(
      (acc, section) => {
        acc[section.id] = section.id === SECTIONS[0].id ? 1 : 0;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const tags = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.tags))).sort(),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTag = selectedTag ? project.tags.includes(selectedTag) : true;
      const normalizedSearch = searchTerm.toLowerCase();
      const matchesSearch = project.name.toLowerCase().includes(normalizedSearch) ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));
      return matchesTag && matchesSearch;
    });
  }, [projects, searchTerm, selectedTag]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionVisibility.current[entry.target.id] = entry.intersectionRatio;
        });

        const nextActive = Object.entries(sectionVisibility.current).reduce(
          (best, [id, ratio]) => {
            if (ratio > best.ratio) {
              return { id, ratio };
            }
            return best;
          },
          { id: SECTIONS[0].id, ratio: -1 }
        ).id;

        setActiveSection((current) => (current === nextActive ? current : nextActive));
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const sectionTweens: gsap.core.Tween[] = [];
      const sections = gsap.utils.toArray<HTMLElement>("section[id]");
      sections.forEach((section) => {
        const tween = gsap.fromTo(
          section,
          { opacity: 0, yPercent: 20, scale: 0.96, filter: "blur(12px)" },
          {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            },
          }
        );
        sectionTweens.push(tween);
      });

      const projectBatch = ScrollTrigger.batch(".project-card", {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, yPercent: 25, scale: 0.94 },
            {
              opacity: 1,
              yPercent: 0,
              scale: 1,
              duration: 1,
              ease: "power4.out",
              stagger: 0.12,
            }
          );
        },
      });

      return () => {
        sectionTweens.forEach((tween) => tween.kill());
        projectBatch.forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef }
  );

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-white">
      <CursorSpotlight />
      <div className="mx-auto flex w-full max-w-7xl items-start gap-12 px-4 py-10 lg:gap-16 lg:px-10">
        <NavSidebar
          sections={SECTIONS}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          socialLinks={socialLinks}
        />
        <main className="relative z-10 flex-1 space-y-36 py-4 lg:py-8 xl:space-y-40">
          <AboutSection />
          <ExperienceSection experiences={experiences} />
          <ProjectsSection
            projects={filteredProjects}
            tags={tags}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
        </main>
      </div>
    </div>
  );
}
