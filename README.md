# 🎈 BirthdayPop

**BirthdayPop** is a real-time, interactive birthday celebration app that brings people together virtually. Guests can send floating balloons filled with heartfelt wishes, while hosts can "pop" them to reveal the messages on a beautiful digital card board.

> "As you blow out your candles, always remember the **One** who gave you the breath to do so!"

---

## ✨ Features

- **Real-time Celebration**: Watch as balloons float across the screen in real-time as guests send their wishes.
- **Interactive Popping**: Hosts can click (or tap) balloons to "pop" them, revealing sticky note wishes on a persistent board.
- **Atmospheric Themes**: Choose from multiple curated "Atmospheres" (Neon Party, Sunset Vibe, etc.) to set the perfect mood.
- **Party Vibe (YouTube Sync)**: Hosts can set a YouTube background track to play synchronized music for everyone in the room.
- **Easy Sharing**: Join via simple Room Codes or scan a generated QR code to jump straight into the party.
- **Premium Design**: Built with modern aesthetics, smooth animations, and interactive confetti effects.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Tailwind CSS 4)
- **Real-time Backend**: [Firebase Firestore](https://firebase.google.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Special Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Firebase project with Firestore enabled.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/usoy410/birthdaypop.git
   cd birthdaypop
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
