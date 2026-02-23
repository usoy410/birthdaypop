"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
    id: string;
    text: string;
    sender: string;
    createdAt: any;
    popped: boolean;
}

export default function Room({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const role = searchParams.get("role") || "guest";
    const [messages, setMessages] = useState<Message[]>([]);
    const [wish, setWish] = useState("");

    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            where("roomCode", "==", id)
            // Removed where("popped", "==", false) to fetch all messages
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];
            // Sort by createdAt to maintain some stability if needed, 
            // though random positioning will be used.
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [id]);

    const sendWish = async () => {
        if (!wish.trim()) return;
        try {
            await addDoc(collection(db, "messages"), {
                roomCode: id,
                text: wish,
                popped: false,
                createdAt: serverTimestamp(),
            });
            setWish("");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-white">
            {/* Background Image - Host Only */}
            {role === "host" && (
                <div
                    className="absolute inset-0 z-0 opacity-90 pointer-events-none bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: 'url("/birthday-cake.png")' }}
                />
            )}

            {/* Background Board for Sticky Notes - Host Only */}
            {role === "host" && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

                    {messages.filter(m => m.popped).map((msg) => (
                        <StickyNote key={msg.id} message={msg} />
                    ))}
                </div>
            )}

            {/* Header */}
            <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/20 p-4 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white">
                    <ArrowLeft className="h-5 w-5" />
                    <span>Exit</span>
                </Link>
                <div className="text-center">
                    <h2 className="text-sm font-medium text-zinc-500">Room</h2>
                    <p className="font-bold tracking-widest">{id}</p>
                </div>
                <div className="w-12" /> {/* Spacer */}
            </header>

            {role === "host" ? (
                <div className="relative h-screen w-full pt-20 z-10 pointer-events-none">
                    <AnimatePresence>
                        {messages.filter(m => !m.popped).map((msg) => (
                            <Balloon key={msg.id} message={msg} />
                        ))}
                    </AnimatePresence>
                    <div className="absolute inset-x-0 bottom-8 text-center text-zinc-500">
                        Wait for guests to send wishes!
                    </div>
                </div>
            ) : (
                <div className="flex h-screen flex-col items-center justify-center p-6 pt-20 z-10">
                    <div className="w-full max-w-sm space-y-6">
                        <h1 className="text-3xl font-bold">Send a Wish</h1>
                        <p className="text-zinc-400">Your message will appear as a balloon for the birthday star!</p>
                        <textarea
                            value={wish}
                            onChange={(e) => setWish(e.target.value)}
                            placeholder="Happy Birthday! You're the best!"
                            className="h-40 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none ring-indigo-500 focus:ring-2"
                        />
                        <button
                            onClick={sendWish}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold transition-all hover:bg-indigo-500 active:scale-95"
                        >
                            <Send className="h-5 w-5" />
                            Send Balloon
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

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

const STICKY_COLORS = [
    "bg-yellow-200 text-yellow-900 shadow-yellow-900/20",
    "bg-pink-200 text-pink-900 shadow-pink-900/20",
    "bg-blue-200 text-blue-900 shadow-blue-900/20",
    "bg-green-200 text-green-900 shadow-green-900/20",
    "bg-purple-200 text-purple-900 shadow-purple-900/20",
];

function StickyNote({ message }: { message: Message }) {
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
            <p className="text-sm break-words">"{message.text}"</p>
        </motion.div>
    );
}

function Balloon({ message }: { message: Message }) {
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
                        whileHover={{ scale: 1.1, rotate: rotation + 5 }}
                        whileTap={{ scale: 0.8 }}
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
