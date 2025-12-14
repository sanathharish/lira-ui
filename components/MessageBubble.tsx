type MessageBubbleProps = {
  sender: "user" | "agent" | "system";
  text: string;
};

export default function MessageBubble({ sender, text }: MessageBubbleProps) {
  const base =
    "max-w-[80%] rounded-xl px-4 py-2 text-sm whitespace-pre-wrap";

  const styles = {
    user: "ml-auto bg-blue-600 text-white",
    agent: "mr-auto bg-gray-200 dark:bg-neutral-700",
    system: "mx-auto bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200",
  };

  return (
    <div className={`${base} ${styles[sender]}`}>
      {text}
    </div>
  );
}
