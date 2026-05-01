"use client";

import { useEffect, useState } from "react";

const DISGUISE_KEY = "haqq_disguise";
export const AUTO_SEND_KEY = "haqq_voice_autosend";
export const VOICE_LANG_KEY = "haqq_voice_lang";

export const VOICE_LANGS: { code: string; label: string }[] = [
  { code: "en-IN", label: "English (India)" },
  { code: "hi-IN", label: "हिंदी" },
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "ur-IN", label: "اردو" },
  { code: "bn-IN", label: "বাংলা" },
  { code: "ta-IN", label: "தமிழ்" },
  { code: "te-IN", label: "తెలుగు" },
  { code: "mr-IN", label: "मराठी" },
  { code: "gu-IN", label: "ગુજરાતી" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ" },
  { code: "kn-IN", label: "ಕನ್ನಡ" },
];

// Always defaults to en-IN unless the user has explicitly chosen otherwise.
// Auto-detecting from navigator.language picked hi-IN for Hindi-locale browsers,
// which then transcribed English speech as phonetic Hindi gibberish — a much
// worse default than just speaking English.
export function getDefaultVoiceLang(): string {
  if (typeof window === "undefined") return "en-IN";
  const stored = localStorage.getItem(VOICE_LANG_KEY);
  if (stored && VOICE_LANGS.find((l) => l.code === stored)) return stored;
  return "en-IN";
}

const DISGUISES = [
  {
    id: "notes",
    label: "My Notes",
    shortName: "Notes",
    color: "#4F46E5",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="3" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="3" y="10.5" width="18" height="3" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="3" y="16" width="12" height="3" rx="1.5" fill="currentColor" opacity=".9"/>
      </svg>
    ),
  },
  {
    id: "calculator",
    label: "Calculator",
    shortName: "Calc",
    color: "#0D9488",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="5" rx="1.5" fill="currentColor" opacity=".9"/>
        <rect x="3" y="10" width="5" height="5" rx="1.5" fill="currentColor" opacity=".85"/>
        <rect x="9.5" y="10" width="5" height="5" rx="1.5" fill="currentColor" opacity=".85"/>
        <rect x="16" y="10" width="5" height="5" rx="1.5" fill="currentColor" opacity=".85"/>
        <rect x="3" y="17" width="5" height="5" rx="1.5" fill="currentColor" opacity=".85"/>
        <rect x="9.5" y="17" width="5" height="5" rx="1.5" fill="currentColor" opacity=".85"/>
        <rect x="16" y="17" width="5" height="5" rx="1.5" fill="currentColor" opacity=".6"/>
      </svg>
    ),
  },
  {
    id: "recipes",
    label: "My Recipes",
    shortName: "Recipes",
    color: "#EA580C",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="13" rx="7" ry="5.5" fill="currentColor" opacity=".9"/>
        <rect x="5" y="13" width="14" height="5" fill="currentColor" opacity=".9"/>
        <rect x="3" y="11.5" width="3" height="2" rx=".8" fill="currentColor" opacity=".8"/>
        <rect x="18" y="11.5" width="3" height="2" rx=".8" fill="currentColor" opacity=".8"/>
        <rect x="11" y="6" width="2" height="5" rx=".8" fill="currentColor" opacity=".8"/>
      </svg>
    ),
  },
  {
    id: "budget",
    label: "Budget Tracker",
    shortName: "Budget",
    color: "#16A34A",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="14" width="5" height="8" rx="1.2" fill="currentColor" opacity=".9"/>
        <rect x="9.5" y="10" width="5" height="12" rx="1.2" fill="currentColor" opacity=".9"/>
        <rect x="16" y="6" width="5" height="16" rx="1.2" fill="currentColor" opacity=".9"/>
      </svg>
    ),
  },
] as const;

type DisguiseId = (typeof DISGUISES)[number]["id"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenSOS: () => void;
}

export default function SettingsSheet({ isOpen, onClose, onOpenSOS }: Props) {
  const [selected, setSelected] = useState<DisguiseId>("notes");
  const [saved, setSaved] = useState(false);
  const [autoSend, setAutoSend] = useState(false);
  const [voiceLang, setVoiceLang] = useState<string>("en-IN");

  useEffect(() => {
    if (!isOpen) return;
    const stored = localStorage.getItem(DISGUISE_KEY) as DisguiseId | null;
    if (stored && DISGUISES.find((d) => d.id === stored)) setSelected(stored);
    setAutoSend(localStorage.getItem(AUTO_SEND_KEY) === "true");
    setVoiceLang(getDefaultVoiceLang());
    setSaved(false);
  }, [isOpen]);

  const handleAutoSendToggle = () => {
    const next = !autoSend;
    setAutoSend(next);
    localStorage.setItem(AUTO_SEND_KEY, String(next));
  };

  const handleVoiceLangChange = (code: string) => {
    setVoiceLang(code);
    localStorage.setItem(VOICE_LANG_KEY, code);
  };

  if (!isOpen) return null;

  const handleApply = () => {
    localStorage.setItem(DISGUISE_KEY, selected);
    document.cookie = `haqq_disguise=${selected};path=/;max-age=31536000;SameSite=Lax`;
    document.title = current.label;
    setSaved(true);
  };

  const current = DISGUISES.find((d) => d.id === selected)!;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="relative bg-white rounded-t-2xl px-4 pt-3 pb-10 max-h-[85vh] overflow-y-auto"
        style={{ animation: "sheet-slide-up 0.25s ease-out" }}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-gray-900">Settings</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Disguise section */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            App disguise
          </p>
          <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">
            Choose how this app appears on your homescreen. Useful if you share a device.
          </p>

          <div className="space-y-2">
            {DISGUISES.map((d) => (
              <button
                key={d.id}
                onClick={() => { setSelected(d.id); setSaved(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
                  selected === d.id ? "border-teal-400 bg-teal-50" : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ backgroundColor: d.color }}
                >
                  {d.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="text-[14px] font-medium text-gray-900">{d.label}</div>
                  <div className="text-[12px] text-gray-400">Homescreen: "{d.shortName}"</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected === d.id ? "border-teal-600 bg-teal-600" : "border-gray-300"
                  }`}
                >
                  {selected === d.id && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8">
                      <path d="M2 5l2.5 2.5L8 3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleApply}
            className="mt-4 w-full py-3 rounded-xl text-white text-[13px] font-semibold"
            style={{ backgroundColor: current.color }}
          >
            Apply disguise
          </button>

          {saved && (
            <p className="mt-3 text-[12px] text-amber-600 leading-relaxed bg-amber-50 rounded-xl px-3 py-2.5">
              ✓ Saved. To update your homescreen icon, remove the app and re-add it to your homescreen.
            </p>
          )}
        </div>

        {/* Voice input */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Voice input</p>

          <div className="px-3 py-3 rounded-xl border border-gray-200 mb-2">
            <div className="text-[14px] font-medium text-gray-900 mb-0.5">Recognition language</div>
            <div className="text-[12px] text-gray-400 mb-2.5">
              Pick the language you usually speak. Speech in other languages may not be transcribed.
            </div>
            <select
              value={voiceLang}
              onChange={(e) => handleVoiceLangChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-[14px] text-gray-900 focus:outline-none focus:border-teal-400"
            >
              {VOICE_LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between px-3 py-3 rounded-xl border border-gray-200">
            <div>
              <div className="text-[14px] font-medium text-gray-900">Auto-send after voice input</div>
              <div className="text-[12px] text-gray-400 mt-0.5">Send automatically after 3s of silence</div>
            </div>
            <button
              onClick={handleAutoSendToggle}
              role="switch"
              aria-checked={autoSend}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${autoSend ? "bg-teal-600" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoSend ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        {/* Trusted contacts shortcut */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Safety</p>
          <button
            onClick={() => { onClose(); onOpenSOS(); }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3.5 5v5c0 4 3 7.4 6.5 8.5C13.5 17.4 16.5 14 16.5 10V5L10 2Z"
                  fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M7.5 10l1.8 1.8L12.5 8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-left flex-1">
              <div className="text-[14px] font-medium text-gray-900">Trusted contacts</div>
              <div className="text-[12px] text-gray-400">Set up SOS emergency contacts</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9CA3AF" strokeWidth="1.6">
              <path d="M5 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
