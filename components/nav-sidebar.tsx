"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SocialLink } from "@/content/data";
import clsx from "clsx";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
};

type NavSidebarProps = {
  sections: { id: string; label: string }[];
  activeSection: string;
  onNavigate: (id: string) => void;
  socialLinks: SocialLink[];
};

export function NavSidebar({
  sections,
  activeSection,
  onNavigate,
  socialLinks,
}: NavSidebarProps) {
  return (
    <aside className="sticky top-0 z-30 flex h-screen w-full max-w-xs shrink-0 flex-col justify-start pt-8 lg:pt-24 self-start">
      <div className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/5 p-8 text-white shadow-[0_25px_120px_-40px_rgba(15,118,110,0.8)] backdrop-blur-xl dark:bg-black/30">
        <div className="space-y-10">
        <div className="flex items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Wong Kang monogram"
            width={56}
            height={56}
            className="rounded-2xl border border-white/10 bg-white/5 p-2"
            priority
          />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-teal-300"></p>
            <h1 className="mt-1 text-3xl font-semibold text-white">Wong Kang</h1>
          </div>
        </div>
        <p className="text-sm text-zinc-400">
          CS @ SUTD · Building AI-infused platforms that make operations calmer and more insightful.
        </p>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              className={clsx(
                "group flex w-full items-center gap-4 rounded-full px-4 py-3 text-left text-sm font-medium tracking-widest transition",
                activeSection === section.id
                  ? "text-teal-300"
                  : "text-zinc-500 hover:text-zinc-100"
              )}
              onClick={() => onNavigate(section.id)}
            >
              <span
                className={clsx(
                  "h-px flex-1 rounded-full bg-gradient-to-r transition",
                  activeSection === section.id
                    ? "from-teal-500/80 to-transparent"
                    : "from-zinc-800 to-transparent"
                )}
              />
              <span>{section.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        <ThemeToggle />
        <div className="flex gap-5">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.platform];
            return (
              <Link
                key={link.platform}
                href={link.href}
                target={link.platform === "email" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={link.label}
                className="text-zinc-500 transition hover:text-teal-300"
              >
                <Icon size={20} />
              </Link>
            );
          })}
        </div>
      </div>
      </div>
    </aside>
  );
}
