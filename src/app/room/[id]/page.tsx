"use client";

import { useSearchParams } from "next/navigation";
import { useState, use, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { Send, ArrowLeft, Copy, Check, Download, Share2, Music, QrCode, Palette, Zap } from "lucide-react";
import Link from "next/link";
import { useMessages } from "@/hooks/useMessages";
import { Balloon } from "@/components/Balloon";
import { StickyNote } from "@/components/StickyNote";
import { UserRole, Room as RoomType } from "@/types";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import confetti from "canvas-confetti";
import { getTheme, THEMES } from "@/lib/themes";

export default function Room({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const role = (searchParams.get("role") || "guest") as UserRole;
    const { messages, loading } = useMessages(id);
    const [wish, setWish] = useState("");
    const [sent, setSent] = useState(false);
    const [copied, setCopied] = useState(false);

    // Theme State
    const [roomData, setRoomData] = useState<RoomType | null>(null);
    const theme = getTheme(roomData?.themeId);

    // Music States
    const [musicUrl, setMusicUrl] = useState("");
    const [showMusicInput, setShowMusicInput] = useState(false);
    const [showThemePicker, setShowThemePicker] = useState(false);

    // Sync Room Theme
    useEffect(() => {
        const roomRef = doc(db, "rooms", id);
        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                setRoomData({ id: snapshot.id, ...snapshot.data() } as RoomType);
            } else if (role === "host") {
                // Initialize room for host if it doesn't exist
                setDoc(roomRef, {
                    themeId: THEMES[0].id,
                    createdAt: serverTimestamp()
                }, { merge: true }).catch(err => console.error("Failed to initialize room:", err));
            }
        });
        return () => unsubscribe();
    }, [id, role]);

    // Handle theme's default music
    useEffect(() => {
        if (theme.defaultMusic && !musicUrl) {
            setMusicUrl(theme.defaultMusic);
        }
    }, [theme.id]);

    const updateTheme = async (themeId: string) => {
        try {
            const roomRef = doc(db, "rooms", id);
            await setDoc(roomRef, { themeId }, { merge: true });
            setShowThemePicker(false);
        } catch (err) {
            console.error("Failed to update theme:", err);
        }
    };

    const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/room/${id}?role=guest` : "";

    const getYoutubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
    };

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

    const handleBalloonPop = () => {
        const poppedCount = messages.filter(m => m.popped).length;
        if ((poppedCount + 1) % 10 === 0) {
            confetti({
                particleCount: 250,
                spread: 160,
                origin: { y: 0.3 },
                colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#ffffff'],
                gravity: 1.2,
                scalar: 1.2
            });
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
        <main
            className="relative min-h-screen overflow-hidden transition-colors duration-1000 text-white"
            style={{ backgroundColor: theme.colors.background }}
        >
            {/* Background Image - Host Only */}
            {role === "host" && (
                <motion.div
                    key={theme.backgroundImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 z-0 pointer-events-none bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url("${theme.backgroundImg}")` }}
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
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{theme.name}</h2>
                    <p className="font-bold tracking-widest">{id}</p>
                </div>

                <div className="flex items-center gap-4">
                    {role === "host" && (
                        <div className="flex items-center gap-2">
                            {/* Theme Switcher */}
                            <div className="group relative">
                                <button
                                    onClick={() => setShowThemePicker(!showThemePicker)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95 bg-white/10 hover:bg-white/20 text-indigo-400`}
                                >
                                    <Palette className="h-5 w-5" />
                                </button>
                                {showThemePicker && (
                                    <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-white/10 bg-zinc-900 p-4 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-right z-[60]">
                                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Select Atmosphere</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {THEMES.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => updateTheme(t.id)}
                                                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${theme.id === t.id ? "bg-indigo-600 text-white" : "bg-white/5 hover:bg-white/10 text-zinc-300"
                                                        }`}
                                                >
                                                    <span className="text-sm font-semibold">{t.name}</span>
                                                    {theme.id === t.id && <Zap className="h-4 w-4 fill-current" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Music Button */}
                            <div className="group relative">
                                <button
                                    onClick={() => setShowMusicInput(!showMusicInput)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95 ${musicUrl ? "bg-indigo-600 text-white" : "bg-white/10 hover:bg-white/20 text-zinc-400"
                                        }`}
                                >
                                    <Music className="h-5 w-5" />
                                </button>
                                {showMusicInput && (
                                    <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-white/10 bg-zinc-900 p-4 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-right z-[60]">
                                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Party Vibe</p>
                                        <input
                                            type="text"
                                            placeholder="YouTube Link (e.g. lofi hip hop)"
                                            value={musicUrl}
                                            onChange={(e) => setMusicUrl(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                        {musicUrl && (
                                            <p className="mt-2 text-[10px] text-green-400 flex items-center gap-1">
                                                <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                                Music Active
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Copy Link Button */}
                            <button
                                onClick={copyInviteLink}
                                className="group relative flex h-10 items-center gap-2 rounded-xl bg-white/10 px-3 hover:bg-white/20 transition-all active:scale-95"
                            >
                                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-zinc-400 group-hover:text-white" />}
                                <span className="hidden text-sm font-medium lg:block">{copied ? "Copied!" : "Copy Link"}</span>
                            </button>

                            {/* QR Code Popover */}
                            <div className="group relative">
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95">
                                    <QrCode className="h-5 w-5" />
                                </button>

                                <div className="absolute right-0 mt-3 hidden group-hover:block w-64 rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-right z-[60]">
                                    <div className="mb-4 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Scan or Share</p>
                                        <h3 className="text-lg font-bold">Party Invite</h3>
                                    </div>

                                    <div className="mb-4 flex justify-center rounded-2xl bg-white p-3 shadow-inner">
                                        <div className="hidden">
                                            <QRCodeCanvas id="qr-canvas" value={inviteLink} size={512} level="H" includeMargin />
                                        </div>
                                        <QRCodeSVG value={inviteLink} size={160} level="H" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            onClick={downloadQR}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold hover:bg-white/20 transition-all"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download Image
                                        </button>
                                        <div className="mt-2 text-center">
                                            <p className="text-[10px] text-zinc-500 truncate">{inviteLink}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hidden Music Player */}
            {role === "host" && musicUrl && getYoutubeEmbedUrl(musicUrl) && (
                <div className="hidden">
                    <iframe
                        width="0"
                        height="0"
                        src={getYoutubeEmbedUrl(musicUrl) || ""}
                        allow="autoplay"
                    />
                </div>
            )}

            {role === "host" ? (
                <div className="relative h-screen w-full pt-20 z-10 pointer-events-none">
                    <AnimatePresence>
                        {messages.filter(m => !m.popped).map((msg) => (
                            <Balloon key={msg.id} message={msg} onPop={handleBalloonPop} themeId={theme.id} />
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
