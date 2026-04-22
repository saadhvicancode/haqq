"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import PanicButton from "@/components/PanicButton";
import SOSButton from "@/components/SOSButton";

const OPENING_MESSAGE =
  `Aadab. Main Haqq hoon — aapki apni legal guide.\n\n` +
  `Whatever you're going through right now — you have rights. And you deserve to know them.\n\n` +
  `Tell me what's happening. You can write in Hindi, English, Urdu, Bengali, Marathi, Tamil, or any Indian language. I'm listening.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

function ChatInterface() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState(
    topic ? `I need help with ${topic}.` : ""
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          topic: newMessages.length <= 2 ? topic : undefined,
        }),
        signal: abort.signal,
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return updated;
        });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm sorry, something went wrong. Please try again in a moment.",
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, isStreaming, messages, topic]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClear = () => {
    if (showClearConfirm) {
      abortRef.current?.abort();
      setMessages([{ role: "assistant", content: OPENING_MESSAGE }]);
      setInput("");
      setIsStreaming(false);
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const streamingIndex = isStreaming ? messages.length - 1 : -1;

  return (
    <div
      className="flex flex-col h-dvh"
      style={{ backgroundColor: "#F7F6F3", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 flex-shrink-0"
        style={{ backgroundColor: "#fff" }}
      >
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M11 14l-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900" style={{ color: "#0D7377" }}>
            Haqq
          </div>
          <div className="text-xs text-gray-400 truncate">
            Hindi, English, Urdu, Bengali, aur aur bhi — theek hai
          </div>
        </div>

        <button
          onClick={handleClear}
          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
            showClearConfirm
              ? "bg-red-100 text-red-600"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          {showClearConfirm ? "Confirm clear?" : "Clear"}
        </button>

        <PanicButton />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg w-full mx-auto">
        {messages.map((msg, i) => {
          if (isStreaming && i === streamingIndex && msg.content === "") return null;
          return (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              isStreaming={isStreaming && i === streamingIndex}
            />
          );
        })}
        {isStreaming && (
          messages[messages.length - 1]?.content === "" ||
          messages[messages.length - 1]?.role === "user"
        ) && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0 border-t border-gray-200 px-4 py-3 max-w-lg w-full mx-auto"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me what's happening..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors max-h-32 overflow-y-auto disabled:opacity-50"
            style={{ lineHeight: "1.5" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-40 flex-shrink-0"
            style={{ backgroundColor: "#0D7377" }}
            aria-label="Send"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M15 9L3 9M15 9l-5-5M15 9l-5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-300">
            Haqq is a guide, not a lawyer · Free · Anonymous
          </span>
        </div>
      </div>

      <SOSButton />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatInterface />
    </Suspense>
  );
}
