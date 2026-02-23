"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, User, Cake } from "lucide-react";

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  const handleJoin = (role: "guest" | "host") => {
    if (!roomCode.trim()) {
      alert("Please enter a Room Code!");
      return;
    }
    router.push(`/room/${roomCode}?role=${role}`);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--background)] px-4">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20 blur-xl"
            initial={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0.3,
            }}
            animate={{
              y: ["-10%", "110%"],
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/30 bg-white/10 p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-8 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4 inline-block rounded-2xl bg-white/20 p-4"
          >
            <PartyPopper className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            BirthdayPop
          </h1>
          <p className="mt-2 text-indigo-100">
            "As you blow out your candles, always remember the <b>One</b> who gave you the breath to do so!"
          </p>
          <p className="text-white italic text-xs font-semibold">-Arjay</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-100">
              Room Code
            </label>
            <input
              type="text"
              placeholder="e.g. PARTY2026"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-lg font-semibold text-white placeholder-white/40 outline-none ring-indigo-400 transition-all focus:ring-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleJoin("guest")}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
            >
              <div className="rounded-xl bg-blue-400/30 p-3 group-hover:bg-blue-400/50">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-white">Join as Guest</span>
            </button>

            <button
              onClick={() => handleJoin("host")}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
            >
              <div className="rounded-xl bg-pink-400/30 p-3 group-hover:bg-pink-400/50">
                <Cake className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-white">Host Party</span>
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
