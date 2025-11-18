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

      const ctx = gsap.context(() => {
        type ScrollAnimationConfig = {
          trigger: string | Element | null;
          elements: HTMLElement[];
          start?: string;
          end?: string;
          initial: gsap.TweenVars;
          enter: gsap.TweenVars;
          leave: gsap.TweenVars;
        };

        type IndividualAnimationConfig = {
          elements: HTMLElement[];
          start?: string;
          end?: string;
          endForNext?: string;
          initial: gsap.TweenVars;
          enter: gsap.TweenVars;
          leave: gsap.TweenVars;
        };

        const createScrollAnimation = ({
          trigger,
          elements,
          start = "top 70%",
          end = "bottom 45%",
          initial,
          enter,
          leave,
        }: ScrollAnimationConfig) => {
          if (!elements.length || !trigger) return;
          const triggerElement = typeof trigger === "string" ? document.querySelector(trigger) : trigger;
          if (!triggerElement) return;

          gsap.set(elements, initial);

          const play = () =>
            gsap.to(elements, {
              ...enter,
              overwrite: "auto",
            });

          const hide = () =>
            gsap.to(elements, {
              ...leave,
              overwrite: "auto",
            });

          ScrollTrigger.create({
            trigger: triggerElement,
            start,
            end,
            onEnter: play,
            onEnterBack: play,
            onLeave: hide,
            onLeaveBack: hide,
          });
        };

        const createIndividualScrollAnimations = ({
          elements,
          start = "top 80%",
          end = "bottom top",
          endForNext = "center center",
          initial,
          enter,
          leave,
        }: IndividualAnimationConfig) => {
          if (!elements.length) return;

          elements.forEach((element, index) => {
            gsap.set(element, initial);

            const nextElement = elements[index + 1];
            const endValue = nextElement ? endForNext : end;

            const play = () =>
              gsap.to(element, {
                ...enter,
                overwrite: "auto",
              });

            const hide = () =>
              gsap.to(element, {
                ...leave,
                overwrite: "auto",
              });

            ScrollTrigger.create({
              trigger: element,
              start,
              end: endValue,
              endTrigger: nextElement ?? element,
              onEnter: play,
              onEnterBack: play,
              onLeave: hide,
              onLeaveBack: hide,
            });
          });
        };

        const aboutCopyPieces = gsap.utils.toArray<HTMLElement>("#about [data-about-copy] > *");
        const aboutPortrait = gsap.utils.toArray<HTMLElement>("#about [data-about-photo]");

        createScrollAnimation({
          trigger: "#about",
          elements: aboutCopyPieces,
          start: "top 80%",
          end: "bottom 45%",
          initial: { autoAlpha: 0, yPercent: 20, filter: "blur(12px)" },
          enter: {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
          },
          leave: {
            autoAlpha: 0,
            yPercent: -8,
            filter: "blur(10px)",
            duration: 0.5,
            ease: "power2.out",
            stagger: { each: 0.05, from: "end" },
          },
        });

        createScrollAnimation({
          trigger: "#about",
          elements: aboutPortrait,
          start: "top 80%",
          end: "bottom 45%",
          initial: { autoAlpha: 0, yPercent: 12, scale: 0.94, filter: "blur(10px)" },
          enter: {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
          },
          leave: {
            autoAlpha: 0,
            yPercent: -6,
            scale: 0.97,
            filter: "blur(10px)",
            duration: 0.5,
            ease: "power2.out",
          },
        });

        const experienceHeadingPieces = gsap.utils.toArray<HTMLElement>(
          "#experience [data-exp-heading] > *"
        );
        const experienceCards = gsap.utils.toArray<HTMLElement>("#experience [data-exp-card]");

        createScrollAnimation({
          trigger: "#experience",
          elements: experienceHeadingPieces,
          start: "top 70%",
          end: "bottom 45%",
          initial: { autoAlpha: 0, yPercent: 15, filter: "blur(10px)" },
          enter: {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
          },
          leave: {
            autoAlpha: 0,
            yPercent: -6,
            filter: "blur(10px)",
            duration: 0.5,
            ease: "power2.out",
            stagger: { each: 0.06, from: "end" },
          },
        });

        createScrollAnimation({
          trigger: "#experience",
          elements: experienceCards,
          start: "top 70%",
          end: "bottom 45%",
          initial: { autoAlpha: 0, yPercent: 15, filter: "blur(10px)" },
          enter: {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
          },
          leave: {
            autoAlpha: 0,
            yPercent: -8,
            filter: "blur(10px)",
            duration: 0.6,
            ease: "power2.out",
            stagger: { each: 0.08, from: "end" },
          },
        });

        const projectsHeadingPieces = gsap.utils.toArray<HTMLElement>(
          "#projects [data-projects-heading] > *"
        );
        const projectsFilters = gsap.utils.toArray<HTMLElement>("#projects [data-projects-filters]");
        const projectCards = gsap.utils.toArray<HTMLElement>("#projects [data-project-card]");
        const projectsEmptyState = gsap.utils.toArray<HTMLElement>("#projects [data-projects-empty]");

        createScrollAnimation({
          trigger: "#projects",
          elements: projectsHeadingPieces,
          start: "top 75%",
          end: "bottom 45%",
          initial: { autoAlpha: 0, yPercent: 20, filter: "blur(14px)" },
          enter: {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
          },
          leave: {
            autoAlpha: 0,
            yPercent: -8,
            filter: "blur(10px)",
            duration: 0.45,
            ease: "power2.out",
            stagger: { each: 0.05, from: "end" },
          },
        });

        createScrollAnimation({
          trigger: "#projects",
          elements: projectsFilters,
          start: "top 75%",
          end: "bottom 45%",
          initial: { autoAlpha: 0, yPercent: 15, filter: "blur(12px)" },
          enter: {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
          },
          leave: {
            autoAlpha: 0,
            yPercent: -6,
            filter: "blur(10px)",
            duration: 0.45,
            ease: "power2.out",
          },
        });

        createIndividualScrollAnimations({
          elements: projectCards,
          start: "top 85%",
          endForNext: "center center",
          end: "bottom top",
          initial: {
            autoAlpha: 0,
            yPercent: 10,
            scale: 0.98,
            filter: "blur(12px)",
            transformOrigin: "center top",
          },
          enter: {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            filter: "blur(0px)",
            transformOrigin: "center top",
            duration: 0.85,
            ease: "power3.out",
          },
          leave: {
            autoAlpha: 0,
            yPercent: -4,
            scale: 0.99,
            filter: "blur(10px)",
            transformOrigin: "center top",
            duration: 0.5,
            ease: "power2.out",
          },
        });

        createScrollAnimation({
          trigger: "#projects",
          elements: projectsEmptyState,
          start: "top 75%",
          end: "bottom 40%",
          initial: { autoAlpha: 0, yPercent: 10, filter: "blur(8px)" },
          enter: {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
          },
          leave: {
            autoAlpha: 0,
            yPercent: -6,
            filter: "blur(8px)",
            duration: 0.45,
            ease: "power2.out",
          },
        });

        ScrollTrigger.refresh();
      }, containerRef);

      return () => ctx.revert();
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
  <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 lg:min-h-screen lg:flex-row lg:items-start lg:gap-16 lg:px-10">
        <NavSidebar
          sections={SECTIONS}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          socialLinks={socialLinks}
        />
        <main className="relative z-10 flex-1 py-4 lg:py-8">
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
