export interface Theme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        accent: string;
        balloonPalettes: string[][];
    };
    backgroundImg?: string;
    defaultMusic?: string;
    isDark: boolean;
}

export const THEMES: Theme[] = [
    {
        id: "cyberpunk",
        name: "Cyberpunk Party",
        colors: {
            primary: "#f0abfc", // pink-300
            secondary: "#38bdf8", // sky-400
            background: "#0f0f12",
            accent: "#6366f1",
            balloonPalettes: [
                ["from-fuchsia-500", "to-fuchsia-700"],
                ["from-cyan-500", "to-cyan-700"],
                ["from-violet-500", "to-violet-700"],
                ["from-pink-500", "to-pink-700"]
            ]
        },
        backgroundImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
        defaultMusic: "https://www.youtube.com/watch?v=5qap5aO4i9A", // Synthwave
        isDark: true
    },
    {
        id: "princess",
        name: "Princess Castle",
        colors: {
            primary: "#fbcfe8", // pink-200
            secondary: "#ddd6fe", // violet-200
            background: "#fdf2f8",
            accent: "#ec4899",
            balloonPalettes: [
                ["from-pink-300", "to-pink-400"],
                ["from-purple-300", "to-purple-400"],
                ["from-rose-200", "to-rose-300"],
                ["from-indigo-200", "to-indigo-300"]
            ]
        },
        backgroundImg: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
        defaultMusic: "https://www.youtube.com/watch?v=z0O6_S9uT8A", // Whimsical
        isDark: false
    },
    {
        id: "gold",
        name: "Classic Gold",
        colors: {
            primary: "#fbbf24", // amber-400
            secondary: "#71717a", // zinc-400
            background: "#18181b",
            accent: "#d4d4d8",
            balloonPalettes: [
                ["from-amber-400", "to-amber-600"],
                ["from-yellow-500", "to-yellow-700"],
                ["from-zinc-400", "to-zinc-600"],
                ["from-amber-200", "to-amber-400"]
            ]
        },
        backgroundImg: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
        defaultMusic: "https://www.youtube.com/watch?v=HMnx22Tz20o", // Party Jazz
        isDark: true
    }
];

export const getTheme = (id?: string) => THEMES.find(t => t.id === id) || THEMES[0];
