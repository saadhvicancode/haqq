"use client";

import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatBubble({
  role,
  content,
  isStreaming,
}: ChatBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div
          className="max-w-[78%] px-4 py-3 rounded-2xl rounded-br-sm text-white text-[15px] leading-relaxed"
          style={{ backgroundColor: "#0D7377" }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
        style={{ backgroundColor: "#0D7377" }}
      >
        H
      </div>
      <div className="max-w-[78%] bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm text-[15px] leading-relaxed text-gray-900">
        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-strong:text-gray-900 prose-headings:text-gray-900">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {isStreaming && (
          <span className="inline-block w-0.5 h-4 bg-teal-700 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );
}
