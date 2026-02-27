"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message } from "@/types";
import confetti from "canvas-confetti";

const BALLOON_COLORS = [
    "from-pink-400 to-pink-600",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-yellow-300 to-yellow-500",
    "from-green-400 to-green-600",
    "from-orange-400 to-orange-600",
    "from-red-400 to-red-600",
    "from-cyan-400 to-cyan-600",
];

export function Balloon({ message }: { message: Message }) {
    const [isPopped, setIsPopped] = useState(false);
    const [isExploded, setIsExploded] = useState(false);
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

    // Random physics-like values
    const floatDuration = Math.random() * 10 + 12;
    const wobbleX = Math.random() * 40 - 20;
    const rotation = Math.random() * 20 - 10;

    const handlePop = async () => {
        if (isPopped) return;
        setIsPopped(true);

        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [color.split('-')[1], color.split('-')[3]] // Simple approximation
        });

        // Brief delay for pop animation before revealing message
        setTimeout(() => setIsExploded(true), 150);

        try {
            const msgRef = doc(db, "messages", message.id);
            await updateDoc(msgRef, { popped: true });
        } catch (e) {
            console.error("Error popping balloon:", e);
        }
    };

    return (
        <motion.div
            initial={{ y: "110vh", x: (Math.random() * 80 + 10) + "vw", rotate: rotation }}
            animate={{
                y: "12vh",
                x: [(Math.random() * 80 + 10) + "vw", (Math.random() * 80 + 10 + wobbleX) + "vw", (Math.random() * 80 + 10) + "vw"],
                rotate: [rotation, rotation + 10, rotation - 10, rotation]
            }}
            transition={{
                y: { duration: floatDuration, ease: "linear" },
                x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute z-10 pointer-events-auto"
        >
            <div className="group relative flex flex-col items-center">
                {!isExploded ? (
                    <motion.div
                        animate={isPopped ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : {}}
                        transition={{ duration: 0.2 }}
                        whileHover={{
                            scale: 1.1,
                            rotate: rotation + 5,
                            transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                        whileTap={{
                            scale: 0.9,
                            scaleX: 1.2,
                            transition: { type: "spring", stiffness: 500, damping: 15 }
                        }}
                        onClick={handlePop}
                        className="relative cursor-pointer"
                    >
                        {/* Balloon Body */}
                        <div className={`h-28 w-24 rounded-full bg-gradient-to-b ${color} shadow-2xl ring-2 ring-white/30 relative overflow-hidden`}>
                            {/* Highlight/Shine */}
                            <div className="absolute top-4 left-4 h-8 w-6 rotate-45 rounded-full bg-white/40 blur-[2px]" />
                        </div>
                        {/* Balloon Knot/String */}
                        <div className="mx-auto mt-[-4px] h-3 w-4 bg-current brightness-90" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
                        <div className="mx-auto h-20 w-0.5 bg-white/30 origin-top rotate-[2deg]" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, y: 0 }}
                        animate={{ scale: 1, opacity: 1, y: -50 }}
                        className="w-72 rounded-[2.5rem] border border-white/30 bg-white/10 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                    >
                        <div className="mb-4 flex justify-center">
                            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">
                                A Sweet Wish
                            </span>
                        </div>
                        <p className="text-2xl font-semibold leading-snug tracking-tight text-white drop-shadow-sm">
                            "{message.text}"
                        </p>
                        <div className="mt-6 h-1 w-12 mx-auto rounded-full bg-indigo-500/50" />
                    </motion.div>
                )}

                {/* Explosion Particles */}
                {isPopped && !isExploded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                                animate={{
                                    x: (Math.random() - 0.5) * 200,
                                    y: (Math.random() - 0.5) * 200,
                                    scale: 0,
                                    opacity: 0
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`absolute h-3 w-3 rounded-full bg-gradient-to-br ${color}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
