"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import InputBar from "@/components/InputBar";
import { sendQuery } from "@/lib/api";

type ChatMessage = {
  sender: "user" | "agent";
  text: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend(query: string) {
    if (!query.trim()) return;

    // 1️⃣ Add user message immediately
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setLoading(true);

    try {
      const res = await sendQuery(query);

      /**
       * UI SAFETY RULE:
       * The UI must ALWAYS render a string.
       * It must never assume backend shape correctness.
       *
       * Priority:
       * final_answer → rag_answer → summary → fallback text
       */
      let botText = "⚠️ No response returned from LIRA.";

      if (typeof res === "string") {
        botText = res;
      } else if (res && typeof res === "object") {
        botText =
          res.final_answer ||
          res.rag_answer ||
          res.summary ||
          "⚠️ LIRA responded, but no readable answer was found.";
      }

      // 2️⃣ Add agent message
      setMessages((prev) => [...prev, { sender: "agent", text: botText }]);
    } catch (error) {
      // Network / backend failure should not crash the UI
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "⚠️ Error contacting LIRA backend. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-black text-black dark:text-white">
      <div className="flex flex-col w-full max-w-4xl mx-auto h-full p-4">
        {/* Chat messages */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto space-y-3 p-2 border rounded-xl bg-white dark:bg-neutral-900 shadow-inner"
        >
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              sender={msg.sender}
              text={msg.text}
            />
          ))}

          {loading && (
            <div className="animate-pulse text-gray-500 dark:text-gray-400">
              LIRA is thinking…
            </div>
          )}
        </div>

        {/* Input */}
        <InputBar onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
