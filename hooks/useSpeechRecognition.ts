"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultVoiceLang } from "@/components/SettingsSheet";

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
  activeLang: string | null;
}

const getSpeechRecognition = (): (new () => SpeechRecognition) | null => {
  if (typeof window === "undefined") return null;
  const w = window as typeof window & {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<SpeechError | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [activeLang, setActiveLang] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noSpeechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the latest interim text so we can promote it to a final transcript
  // if recognition ends without ever firing a `final` result (common for short
  // utterances or when audio quality is mediocre).
  const interimRef = useRef("");

  useEffect(() => {
    setIsSupported(getSpeechRecognition() !== null);
  }, []);

  const clearTimers = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
  };

  const stopListening = useCallback(() => {
    // Capture any pending interim text and promote it to the transcript
    // synchronously, BEFORE stopping the recognizer. This is the single,
    // reliable commit path — onend used to also promote, but the timing
    // could leave the textarea briefly empty (between stop and onend),
    // and racy double-commits could overwrite text the user typed.
    const pending = interimRef.current;
    interimRef.current = "";
    if (pending) {
      setTranscript((prev) => prev + pending);
    }
    clearTimers();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // recognition may already be stopping; safe to ignore
      }
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
    interimRef.current = "";

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    // Pulled from the user's setting (Settings → Voice input). Defaults to the
    // browser locale or en-IN. Hardcoding hi-IN rejected English speech;
    // hardcoding en-IN rejected Hindi speech — neither is right by itself.
    const lang = getDefaultVoiceLang();
    recognition.lang = lang;
    recognition.maxAlternatives = 1;
    setActiveLang(lang);

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
      // Reset both the no-speech and silence timers on ANY activity. The
      // silence timer used to only arm after a `final` result, but with
      // some languages (or short utterances) the recognizer never finalizes
      // and the mic would run until the safety cap — defeating the
      // "stop after 3s of silence" setting.
      if (noSpeechTimerRef.current) clearTimeout(noSpeechTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

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
        interimRef.current = "";
      } else {
        setInterimTranscript(interim);
        interimRef.current = interim;
      }

      silenceTimerRef.current = setTimeout(() => {
        try { recognition.stop(); } catch {}
      }, 3000);
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
      // Recognition ended on its own (user stopped speaking, safety timeout,
      // or browser-driven end). If there's interim text we never finalized,
      // promote it now so the user doesn't lose what they said.
      // (When stopListening() was the trigger, interimRef was already cleared
      // there, so this branch is naturally a no-op — no double-commit.)
      if (interimRef.current) {
        const pending = interimRef.current;
        interimRef.current = "";
        setTranscript((prev) => prev + pending);
      }
      setInterimTranscript("");
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      // Hard cap on session length. Recognizers can spin indefinitely producing
      // interim-only results when the language is mismatched or background
      // noise tricks the VAD; this guarantees the mic always stops. 6s used
      // to cut off mid-sentence when the silence timer didn't fire — now
      // that the silence timer is reliable, this is just a backstop.
      safetyTimeoutRef.current = setTimeout(() => {
        try { recognition.stop(); } catch {}
      }, 60000);
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
    activeLang,
  };
}
