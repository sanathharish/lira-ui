"use client";

import { useState } from "react";

export default function InputBar({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled?: boolean;
}) {
  const [msg, setMsg] = useState("");

  function submit() {
    if (!msg.trim()) return;
    onSend(msg.trim());
    setMsg("");
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <input
        value={msg}
        disabled={disabled}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Ask LIRA anything..."
        className="flex-1 px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 
        text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={submit}
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-40 
        hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  );
}
