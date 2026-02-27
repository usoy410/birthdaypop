import { Timestamp } from "firebase/firestore";

export interface Message {
    id: string;
    text: string;
    roomCode: string;
    popped: boolean;
    createdAt: Timestamp | null;
}

export type UserRole = "guest" | "host";
