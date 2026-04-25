"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import TrustedContactsSheet, {
  CONTACTS_KEY,
  Contact,
  formatPhone,
} from "@/components/TrustedContactsSheet";

const PENDING_KEY = "haqq_pending_sos";
// SVG ring: button is w-11 (44px), ring sits just outside it
const R = 24; // ring radius in the 56×56 SVG viewport
const CIRC = 2 * Math.PI * R; // ≈ 150.796

function loadContacts(): Contact[] {
  try {
    const stored = JSON.parse(localStorage.getItem(CONTACTS_KEY) ?? "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

interface Props {
  onOpenContactsSheet?: () => void;
}

export default function SOSButton({ onOpenContactsSheet }: Props) {
  const { getPosition } = useGeolocation();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pressing, setPressing] = useState(false);
  const [pressKey, setPressKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load contacts on mount
  useEffect(() => {
    setContacts(loadContacts());
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const triggerSOS = useCallback(async () => {
    pressTimer.current = null;
    setPressing(false);

    const saved = loadContacts();
    if (saved.length === 0) {
      if (onOpenContactsSheet) onOpenContactsSheet();
      else setSheetOpen(true);
      return;
    }

    if (!navigator.onLine) {
      localStorage.setItem(PENDING_KEY, "true");
      showToast("You're offline — will send when connection returns");
      return;
    }

    const geo = await getPosition();
    const message = geo.available
      ? `I need help. My current location: https://maps.google.com/?q=${geo.lat},${geo.lng} — Please check on me immediately. Sent via Haqq.`
      : `I need help. Location unavailable — Please check on me immediately. Sent via Haqq.`;

    const encoded = encodeURIComponent(message);
    saved.forEach((c, i) => {
      setTimeout(() => {
        const phone = formatPhone(c.phone);
        const a = document.createElement("a");
        a.href = `https://wa.me/${phone}?text=${encoded}`;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.click();
      }, i * 500);
    });

    const names = saved.map((c) => c.name || "contact").join(", ");
    showToast(`Message sent to ${names}`);
  }, [getPosition, showToast]);

  // Auto-send pending SOS when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (localStorage.getItem(PENDING_KEY)) {
        localStorage.removeItem(PENDING_KEY);
        triggerSOS();
      }
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [triggerSOS]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setPressKey((k) => k + 1);
    setPressing(true);
    pressTimer.current = setTimeout(triggerSOS, 2000);
  };

  const cancelPress = useCallback(() => {
    if (!pressing) return;
    setPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
      // Short tap — no SOS triggered
      const saved = loadContacts();
      if (saved.length === 0) {
        setSheetOpen(true);
      } else {
        showToast("Hold 2 seconds to send SOS");
      }
    }
  }, [pressing, showToast]);

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-white text-[13px] font-medium shadow-lg whitespace-nowrap"
          style={{
            backgroundColor: "rgba(15,15,15,0.85)",
            animation: "toast-in 0.2s ease-out",
          }}
        >
          {toast}
        </div>
      )}

      {/* SOS Button */}
      <div
        className="fixed z-40"
        style={{ bottom: 100, left: 16 }}
      >
        {/* Countdown ring SVG — sits just outside the button */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          className="absolute -inset-1.5 pointer-events-none"
          style={{ top: -6, left: -6 }}
        >
          {/* Background track */}
          <circle
            cx="28" cy="28" r={R}
            fill="none"
            stroke="rgba(239,68,68,0.2)"
            strokeWidth="3"
          />
          {/* Animated fill */}
          {pressing && (
            <circle
              key={pressKey}
              cx="28" cy="28" r={R}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC}
              style={{
                transformOrigin: "28px 28px",
                transform: "rotate(-90deg)",
                animation: `sos-ring 2s linear forwards`,
              }}
            />
          )}
        </svg>

        {/* Main button */}
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={cancelPress}
          onPointerLeave={cancelPress}
          onPointerCancel={cancelPress}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="SOS"
          className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md select-none"
          style={{
            backgroundColor: pressing ? "#dc2626" : "#ef4444",
            touchAction: "none",
            animation: pressing ? "sos-pulse 0.6s ease-in-out infinite" : "none",
          }}
        >
          {/* Shield icon */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L3.5 5v5c0 4 3 7.4 6.5 8.5C13.5 17.4 16.5 14 16.5 10V5L10 2Z"
              fill="white"
              fillOpacity="0.25"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 10l1.8 1.8L12.5 8"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Gear icon — opens contacts settings */}
        <button
          onClick={() => onOpenContactsSheet ? onOpenContactsSheet() : setSheetOpen(true)}
          aria-label="Edit trusted contacts"
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Fallback sheet when used standalone (no external handler) */}
      {!onOpenContactsSheet && (
        <TrustedContactsSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onSaved={(saved) => setContacts(saved)}
        />
      )}
    </>
  );
}
