"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";

const STICKY_COLORS = [
    "bg-yellow-200 text-yellow-900 shadow-yellow-900/20",
    "bg-pink-200 text-pink-900 shadow-pink-900/20",
    "bg-blue-200 text-blue-900 shadow-blue-900/20",
    "bg-green-200 text-green-900 shadow-green-900/20",
    "bg-purple-200 text-purple-900 shadow-purple-900/20",
];

export function StickyNote({ message }: { message: Message }) {
    // Generate a pseudo-random position based on message ID for consistency
    const seed = message.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const left = (seed % 80) + 10; // 10% to 90%
    const top = ((seed * 7) % 60) + 20; // 20% to 80%
    const rotate = (seed % 12) - 6; // -6 to 6 deg
    const color = STICKY_COLORS[seed % STICKY_COLORS.length];

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileDrag={{ scale: 1.1, zIndex: 100, cursor: "grabbing" }}
            className={`absolute p-4 w-40 min-h-[100px] shadow-lg flex flex-col items-center justify-center text-center font-medium cursor-grab pointer-events-auto ${color}`}
            style={{
                left: `${left}%`,
                top: `${top}%`,
                rotate: `${rotate}deg`,
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' // Subtle dog-ear effect
            }}
        >
            <p className="text-xl break-words font-organic leading-tight">"{message.text}"</p>
        </motion.div>
    );
}
