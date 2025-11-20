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
    const [showGame, setShowGame] = useState(true);

    const handleGameComplete = () => {
        setShowGame(false);
    };

    return (
        <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
                {showGame ? (
                    <motion.div
                        key="game"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                        className="absolute inset-0 z-50"
                    >
                        <MountainAscentGame onComplete={handleGameComplete} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="portfolio"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="relative z-0"
                    >
                        <PortfolioPage
                            experiences={experiences}
                            projects={projects}
                            socialLinks={socialLinks}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
