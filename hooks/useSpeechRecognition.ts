"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechError =
  | "not-supported"
  | "permission-denied"
  | "no-speech"
  | "network"
  | "aborted"
  | "unknown";

export interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  error: SpeechError | null;
  hasPermission: boolean | null;
  clearTranscript: () => void;
}

const getSpeechRecognition = (): typeof window.SpeechRecognition | null => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<SpeechError | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSupported = typeof window !== "undefined" && getSpeechRecognition() !== null;

  const clearTimers = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
  };

  const stopListening = useCallback(() => {
    clearTimers();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionClass = getSpeechRecognition();
    if (!SpeechRecognitionClass) return;

    setError(null);
    setTranscript("");
    setInterimTranscript("");

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "hi-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setHasPermission(true);

      // Auto-stop after 10s if no speech detected
      noSpeechTimerRef.current = setTimeout(() => {
        recognition.stop();
        setError("no-speech");
      }, 10000);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Reset no-speech timer on any result
      if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);

      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
        setInterimTranscript("");

        // Auto-stop after 3s of silence following final result
        clearTimers();
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
        }, 3000);
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      clearTimers();
      setIsListening(false);
      setInterimTranscript("");

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setHasPermission(false);
        setError("permission-denied");
      } else if (event.error === "no-speech") {
        setError("no-speech");
      } else if (event.error === "network") {
        setError("network");
      } else if (event.error === "aborted") {
        // Silent abort — user or code triggered stop
        setError(null);
      } else {
        setError("unknown");
      }
    };

    recognition.onend = () => {
      clearTimers();
      setIsListening(false);
      setInterimTranscript("");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setError("unknown");
      setIsListening(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    error,
    hasPermission,
    clearTranscript,
  };
}
