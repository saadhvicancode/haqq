"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import PanicButton from "@/components/PanicButton";
import SOSButton from "@/components/SOSButton";
import OfflineIndicator from "@/components/OfflineIndicator";
import SettingsSheet, { AUTO_SEND_KEY } from "@/components/SettingsSheet";
import TrustedContactsSheet from "@/components/TrustedContactsSheet";
import MicButton from "@/components/MicButton";
import MicPermissionSheet from "@/components/MicPermissionSheet";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sosSheetOpen, setSosSheetOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showPermissionSheet, setShowPermissionSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [autoSend, setAutoSend] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isListening,
    isSupported: micSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    error: micError,
    hasPermission,
    clearTranscript,
  } = useSpeechRecognition();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  // Sync auto-send preference from localStorage
  useEffect(() => {
    setAutoSend(localStorage.getItem(AUTO_SEND_KEY) === "true");
  }, [settingsOpen]);

  // When speech recognition produces a final transcript, populate the input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      clearTranscript();
      inputRef.current?.focus();

      if (autoSend) {
        if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
        autoSendTimerRef.current = setTimeout(() => {
          sendMessage();
        }, 300);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // Show errors from speech recognition as toasts
  useEffect(() => {
    if (!micError) return;
    if (micError === "permission-denied") return; // handled via sheet
    if (micError === "no-speech") showToast("No speech detected — try again");
    else if (micError === "network") showToast("Voice input needs an internet connection");
    else if (micError !== "aborted") showToast("Voice input error — please try again");
  }, [micError, showToast]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      return;
    }
    if (hasPermission === false) {
      showToast("Microphone access is needed for voice input. Enable it in your browser settings, or just type instead.");
      return;
    }
    // Show permission explanation sheet before first request
    if (hasPermission === null) {
      setShowPermissionSheet(true);
      return;
    }
    startListening();
  };

  const handlePermissionAllow = () => {
    setShowPermissionSheet(false);
    startListening();
  };

  // Spacebar shortcut: hold spacebar when input is empty to activate mic
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body && !isListening && micSupported) {
        e.preventDefault();
        handleMicClick();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, micSupported, hasPermission]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

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

        <OfflineIndicator />

        <Link
          href="/directory"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Find help near you"
          title="Find help near you"
        >
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M9 2C6.2 2 4 4.2 4 7c0 3.8 5 9 5 9s5-5.2 5-9c0-2.8-2.2-5-5-5z" />
            <circle cx="9" cy="7" r="1.8" />
          </svg>
        </Link>

        <button
          onClick={() => setSettingsOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Settings"
        >
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="9" cy="9" r="2.5" />
            <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" strokeLinecap="round" />
          </svg>
        </button>

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

      {/* Offline banner */}
      {!isOnline && (
        <div className="flex-shrink-0 bg-amber-50 border-b border-amber-100 px-4 py-2.5 text-[12px] text-amber-700 text-center">
          You&apos;re offline — Haqq can&apos;t answer new questions right now, but your{" "}
          <Link href="/directory" className="underline font-medium">directory</Link> still works
        </div>
      )}

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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%]">
          <div className="bg-gray-900 text-white text-[13px] px-4 py-3 rounded-2xl shadow-lg leading-relaxed text-center">
            {toast}
          </div>
        </div>
      )}

      {/* Screen reader live region for voice state */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isListening ? "Listening for voice input" : ""}
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0 border-t border-gray-200 px-4 py-3 max-w-lg w-full mx-auto"
        style={{ backgroundColor: "#fff" }}
      >
        {/* Listening status */}
        {isListening && (
          <div className="text-[12px] text-red-500 font-medium mb-2 text-center animate-pulse">
            Listening... speak in Hindi or English
          </div>
        )}

        <div className="flex items-end gap-2">
          {micSupported && (
            <MicButton
              isListening={isListening}
              onClick={handleMicClick}
              disabled={isStreaming}
            />
          )}

          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={isListening && interimTranscript ? interimTranscript : input}
              onChange={(e) => {
                if (!isListening) setInput(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "" : "Tell me what's happening..."}
              rows={1}
              disabled={isStreaming}
              readOnly={isListening}
              className={`w-full resize-none rounded-2xl border bg-gray-50 px-4 py-3 text-[15px] placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white transition-colors max-h-32 overflow-y-auto disabled:opacity-50 ${
                isListening && interimTranscript
                  ? "text-gray-400 italic border-red-200"
                  : "text-gray-900 border-gray-200"
              }`}
              style={{ lineHeight: "1.5" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
              }}
            />
          </div>

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

      <SOSButton onOpenContactsSheet={() => setSosSheetOpen(true)} />

      <SettingsSheet
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenSOS={() => setSosSheetOpen(true)}
      />

      <TrustedContactsSheet
        isOpen={sosSheetOpen}
        onClose={() => setSosSheetOpen(false)}
        onSaved={() => setSosSheetOpen(false)}
      />

      <MicPermissionSheet
        isOpen={showPermissionSheet}
        onAllow={handlePermissionAllow}
        onDismiss={() => setShowPermissionSheet(false)}
      />
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
