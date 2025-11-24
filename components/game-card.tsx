"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import MountainAscentGame from "./MountainAscentGame";

gsap.registerPlugin(ScrollToPlugin);

export function GameCard() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [gameKey, setGameKey] = useState(0);

    const handleExpand = () => {
        setIsExpanded(true);
        if (hasCompleted) {
            setGameKey((prev) => prev + 1);
            setHasCompleted(false);
        }
    };

    const handleGameComplete = () => {
        setHasCompleted(true);
        // Scroll to about section with a smooth, gentle animation
        gsap.to(window, {
            duration: 2.5,
            scrollTo: { y: "#about", offsetY: 50 },
            ease: "power2.inOut",
            delay: 0.5
        });
    };

    return (
        <motion.div
            className="relative w-full overflow-hidden rounded-[36px] border border-white/5 bg-white/5 shadow-2xl backdrop-blur"
            initial={false}
            animate={{
                height: isExpanded ? "700px" : "160px",
            }}
            transition={{
                duration: 0.6,
                ease: [0.4, 0.0, 0.2, 1],
            }}
        >
            {/* Always render the game */}
            <div className="h-full w-full">
                <MountainAscentGame key={gameKey} onComplete={handleGameComplete} />
            </div>

            {/* Overlay in collapsed or completed state */}
            {(!isExpanded || hasCompleted) && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/30 backdrop-blur-sm transition-all hover:bg-black/40"
                    onClick={handleExpand}
                >
                    <div className="group flex flex-col items-center gap-4 text-center">
                        <h2 className="text-4xl font-bold text-white md:text-5xl">
                            My Story
                        </h2>
                        <p className="text-lg text-white/70">
                            {hasCompleted ? "Click to replay the journey" : "Click to start the journey"}
                        </p>
                        <div className="mt-2 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-white transition-colors group-hover:bg-white/20">
                            {hasCompleted ? "Replay" : "Begin"}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
