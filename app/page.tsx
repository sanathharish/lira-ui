"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import InputBar from "@/components/InputBar";
import { sendQuery } from "@/lib/api";

type Message = {
  sender: "user" | "agent" | "system";
  text: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend(query: string) {
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setLoading(true);

    try {
      const res = await sendQuery(query);

      const botText =
        typeof res === "string"
          ? res
          : res.final_answer ??
            res.rag_answer ??
            res.summary ??
            "⚠️ No usable answer returned by agent.";

      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: botText },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: "⚠️ Failed to contact LIRA backend. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-black text-black dark:text-white">
      <div className="flex flex-col w-full max-w-4xl mx-auto h-full p-4">
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto space-y-3 p-3
                     border rounded-xl
                     bg-white dark:bg-neutral-900 shadow-inner"
        >
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              sender={msg.sender}
              text={msg.text}
            />
          ))}

          {loading && (
            <div className="animate-pulse text-sm text-gray-500 dark:text-gray-400">
              LIRA is thinking…
            </div>
          )}
        </div>

        <InputBar onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
