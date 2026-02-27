"use client";

import { useSearchParams } from "next/navigation";
import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Send, ArrowLeft, Copy, Check, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { useMessages } from "@/hooks/useMessages";
import { Balloon } from "@/components/Balloon";
import { StickyNote } from "@/components/StickyNote";
import { UserRole } from "@/types";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { QrCode } from "lucide-react";

export default function Room({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const role = (searchParams.get("role") || "guest") as UserRole;
    const { messages, loading } = useMessages(id);
    const [wish, setWish] = useState("");
    const [sent, setSent] = useState(false);
    const [copied, setCopied] = useState(false);

    const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/room/${id}?role=guest` : "";

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
        }
    };

    const downloadQR = () => {
        const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `birthdaypop-room-${id}.png`;
            link.href = url;
            link.click();
        }
    };

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
            setSent(true);
            setTimeout(() => setSent(false), 3000);
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
                <div className="flex flex-col items-center">
                    <h2 className="text-sm font-medium text-zinc-500">Room</h2>
                    <p className="font-bold tracking-widest">{id}</p>
                </div>

                <div className="flex items-center gap-4">
                    {role === "host" && (
                        <div className="group relative">
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                                <QrCode className="h-5 w-5" />
                            </button>
                            {/* QR Code Popover */}
                            <div className="absolute right-0 mt-2 hidden group-hover:block w-48 rounded-2xl bg-white p-4 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-right">
                                <p className="mb-2 text-center text-[10px] font-bold uppercase text-zinc-500">Scan to Join</p>
                                <div className="flex justify-center bg-white p-2 rounded-lg">
                                    <QRCodeSVG
                                        value={typeof window !== 'undefined' ? `${window.location.origin}/room/${id}?role=guest` : ""}
                                        size={128}
                                    />
                                </div>
                                <p className="mt-2 text-center text-[8px] text-zinc-400 break-all">{typeof window !== 'undefined' ? `${window.location.origin}/room/${id}?role=guest` : ""}</p>
                            </div>
                        </div>
                    )}
                    <div className="w-12 md:w-auto" /> {/* Spacer */}
                </div>
            </header>

            {role === "host" ? (
                <div className="relative h-screen w-full pt-20 z-10 pointer-events-none">
                    <AnimatePresence>
                        {messages.filter(m => !m.popped).map((msg) => (
                            <Balloon key={msg.id} message={msg} />
                        ))}
                    </AnimatePresence>
                    <div className="absolute inset-x-0 bottom-8 text-center text-zinc-500">
                        {loading ? "Loading vibes..." : "Wait for guests to send wishes!"}
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
                            disabled={sent}
                            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-95 ${sent ? "bg-green-600 cursor-default" : "bg-indigo-600 hover:bg-indigo-500"
                                }`}
                        >
                            {sent ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <span>Balloon Sent!</span>
                                    <span>🎈</span>
                                </motion.div>
                            ) : (
                                <>
                                    <Send className="h-5 w-5" />
                                    <span>Send Balloon</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
