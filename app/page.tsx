"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import InputBar from "@/components/InputBar";
import { sendQuery } from "@/lib/api";

export default function HomePage() {
  const [messages, setMessages] = useState<
    { sender: "user" | "agent"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend(query: string) {
    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setLoading(true);

    try {
      const res = await sendQuery(query);

      // Extract safe bot text
      const botText =
        typeof res === "string"
          ? res
          : res.final_answer ||
            res.rag_answer ||
            res.summary ||
            "⚠️ No final_answer returned from API.";

      // Add bot message
      setMessages((prev) => [...prev, { sender: "agent", text: botText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "⚠️ Error contacting LIRA backend." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-black text-black dark:text-white">
      <div className="flex flex-col w-full max-w-4xl mx-auto h-full p-4">
        {/* Messages */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto space-y-3 p-2 border rounded-xl bg-white dark:bg-neutral-900 shadow-inner"
        >
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
          ))}

          {loading && (
            <div className="animate-pulse text-gray-500 dark:text-gray-400">
              LIRA is thinking…
            </div>
          )}
        </div>

        {/* Input bar */}
        <InputBar onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
