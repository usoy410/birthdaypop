import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Message } from "@/types";

export function useMessages(roomCode: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomCode) return;

        const q = query(
            collection(db, "messages"),
            where("roomCode", "==", roomCode)
            // Note: If you want items ordered, they need a composite index in Firebase
            // orderBy("createdAt", "asc") 
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];
            setMessages(msgs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching messages:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roomCode]);

    return { messages, loading };
}
