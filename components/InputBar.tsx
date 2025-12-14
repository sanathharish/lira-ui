"use client";

import { useState } from "react";

type InputBarProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function InputBar({ onSend, disabled = false }: InputBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter = send
    // Shift+Enter = newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="mt-3 flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask LIRA something…"
        rows={2}
        className="
          flex-1 resize-none rounded-lg border px-3 py-2
          bg-white dark:bg-neutral-800
          text-black dark:text-white
          border-gray-300 dark:border-neutral-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-60
        "
      />

      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="
          rounded-lg px-4 py-2 font-medium
          bg-blue-600 text-white
          hover:bg-blue-700
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        Send
      </button>
    </div>
  );
}
