export default function MessageBubble({ sender, text }: { sender: string; text: string }) {
  return (
    <div
      className={`w-full px-4 py-2 rounded-lg my-2 ${
        sender === "user"
          ? "bg-blue-600 text-white self-end"
          : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      }`}
      style={{ whiteSpace: "pre-wrap" }}
    >
      {text}
    </div>
  );
}
