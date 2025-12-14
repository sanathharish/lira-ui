"use client";

import { useState, KeyboardEvent } from "react";

type InputBarProps = {
  onSend: (query: string) => void;
  disabled?: boolean;
};

export default function InputBar({ onSend, disabled = false }: InputBarProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function validate(text: string): boolean {
    if (!text.trim()) {
      setError("Please enter a question.");
      return false;
    }
    if (text.length > 1000) {
      setError("Query is too long.");
      return false;
    }
    setError(null);
    return true;
  }

  function handleSend() {
    if (disabled) return;
    if (!validate(input)) return;

    onSend(input.trim());
    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask LIRA something…"
          className="flex-1 rounded-lg border px-4 py-2 text-sm
                     bg-white dark:bg-neutral-800
                     border-gray-300 dark:border-neutral-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:opacity-50"
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          className="rounded-lg px-4 py-2 text-sm font-medium
                     bg-blue-600 text-white
                     hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {error && (
        <div className="mt-1 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
