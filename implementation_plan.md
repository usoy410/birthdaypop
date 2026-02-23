# Implementation Plan: BirthdayPop Next.js Migration

We will upgrade the "Balloon Pop Parade" from a simple Vanilla JS project to a modern, high-performance **Next.js** application. This will provide better state management, smoother animations, and a more professional feel.

## User Review Required

> [!IMPORTANT]
> **Next.js Transition**: This shift introduces a build step (using Vercel for deployment is recommended). 
> **Data Flow**: We will use Firebase for real-time updates, but the architecture will now be component-based (React), which makes "The Balloon Pop Parade" game more modular and easier to polish.

## Proposed Changes

### [Frontend] Next.js Application
We will use Next.js 14+ with the App Router for a sleek, fast experience.

#### [NEW] [Project Structure](file:///home/usoy/Documents/birthdaypop/)
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (for physics-based balloon floating and popping)
- **Database**: Firebase Firestore

#### [NEW] [Home Page](file:///home/usoy/Documents/birthdaypop/app/page.tsx)
- Unified entry point with a "premium" feel.
- Glassmorphism UI for room code entry.
- Dynamic background with subtle floating balloons.

#### [NEW] [Room Page](file:///home/usoy/Documents/birthdaypop/app/room/[id]/page.tsx)
- **Guest Side**:
    - Interactive text input for birthday wishes.
    - "Send Balloon" animation that gives immediate feedback.
- **Birthday Star Side**:
    - The full "Balloon Pop Parade" game engine.
    - Balloons float up from the bottom; clicking/tapping pops them to reveal messages.
    - Haptic feedback (if supported) and "pop" sound effects.

### [Backend] Firebase Configuration
- **Firestore**: Real-time listener in the `Room` component to sync balloons.
- **Security Rules**: Basic room-based isolation to ensure messages go to the right party.

## Verification Plan

### Automated Tests
- `npm run lint`: Verify code quality and accessibility.
- `npm run build`: Ensure the project compiles correctly.

### Manual Verification
1. **Multi-Device Test**: Open the app on a phone (Guest) and a laptop (Host).
2. **Real-time Sync**: Verify that clicking "Send" on the Guest side makes a balloon appear *instantly* on the Host side.
3. **Game Mechanics**: Ensure balloons pop cleanly and messages are legible on different screen sizes.
4. **Edge Cases**: Test empty messages and extremely long messages.

