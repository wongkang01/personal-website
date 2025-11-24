"use client";

import { useState } from "react";
import MountainAscentGame from "@/components/MountainAscentGame";
import { PortfolioPage } from "@/components/portfolio-page";
import { Experience, Project, SocialLink } from "@/content/data";
import { AnimatePresence, motion } from "framer-motion";

type HomeClientProps = {
    experiences: Experience[];
    projects: Project[];
    socialLinks: SocialLink[];
};

export default function HomeClient({
    experiences,
    projects,
    socialLinks,
}: HomeClientProps) {
    return (
        <div className="relative w-full min-h-screen bg-black">
            <PortfolioPage
                experiences={experiences}
                projects={projects}
                socialLinks={socialLinks}
            />
        </div>
    );
}
