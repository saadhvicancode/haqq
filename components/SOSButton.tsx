"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGeolocation, GeoResult } from "@/hooks/useGeolocation";
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

function buildMessage(geo: GeoResult | null): string {
  if (geo?.available) {
    return `I need help. My current location: https://maps.google.com/?q=${geo.lat},${geo.lng} — Please check on me immediately. Sent via Haqq.`;
  }
  return `I need help. Location unavailable — Please check on me immediately. Sent via Haqq.`;
}

interface Props {
  onOpenContactsSheet?: () => void;
}

export default function SOSButton({ onOpenContactsSheet }: Props) {
  const { getPosition } = useGeolocation();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [pressKey, setPressKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Confirmation sheet state — opens after a successful 2s hold
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingContacts, setPendingContacts] = useState<Contact[]>([]);
  const [position, setPosition] = useState<GeoResult | null>(null);
  const [posLoading, setPosLoading] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // The 2s hold completes — prepare and open the confirmation sheet.
  // We do NOT auto-open WhatsApp here: by this point the user-gesture token
  // has expired, so any window.open() / a.click() would be silently blocked
  // by popup blockers. The user taps "Send" inside the sheet (fresh gesture)
  // to actually open WhatsApp.
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

    setPendingContacts(saved);
    setSentIds(new Set());
    setPosition(null);
    setPosLoading(true);
    setConfirmOpen(true);

    // Fetch location in the background so it's ready by the time the user taps Send.
    const geo = await getPosition();
    setPosition(geo);
    setPosLoading(false);
  }, [getPosition, onOpenContactsSheet, showToast]);

  // Re-trigger when coming back online if a previous attempt was pending.
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

  // Per-contact send — runs from a real click event so the popup is allowed.
  const handleSendToContact = (c: Contact) => {
    const message = buildMessage(position);
    const encoded = encodeURIComponent(message);
    const phone = formatPhone(c.phone);
    const url = `https://wa.me/${phone}?text=${encoded}`;

    // window.open from a synchronous click handler preserves the user gesture
    // and reliably opens WhatsApp (web or installed app).
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      // Popup was still blocked — fall back to navigating in this tab so the
      // user at least lands on WhatsApp. They can return via the back button.
      window.location.href = url;
      return;
    }
    setSentIds((prev) => new Set(prev).add(c.id));
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    if (sentIds.size > 0) {
      const names = pendingContacts
        .filter((c) => sentIds.has(c.id))
        .map((c) => c.name || "contact")
        .join(", ");
      showToast(`Opened WhatsApp for ${names} — press SEND there to deliver`);
    }
  };

  const allSent =
    pendingContacts.length > 0 && sentIds.size === pendingContacts.length;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-white text-[13px] font-medium shadow-lg max-w-[90%] text-center"
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

      {/* Confirmation sheet — shown after the 2s hold completes */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closeConfirm} />
          <div
            className="relative bg-white rounded-t-2xl px-4 pt-3 pb-8 max-h-[88vh] overflow-y-auto"
            style={{ animation: "sheet-slide-up 0.25s ease-out" }}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2L3.5 5v5c0 4 3 7.4 6.5 8.5C13.5 17.4 16.5 14 16.5 10V5L10 2Z"
                    fill="#ef4444"
                    fillOpacity="0.2"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-gray-900 mb-0.5">
                  Send SOS to your contacts
                </h2>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Tap each contact below. WhatsApp will open with the message —{" "}
                  <strong className="text-gray-700">press SEND there</strong> to deliver it.
                </p>
              </div>
            </div>

            {/* Location status */}
            <div
              className="rounded-lg px-3 py-2 mb-3 text-[12px] flex items-center gap-2"
              style={{
                backgroundColor: position?.available
                  ? "#ECFDF5"
                  : posLoading
                  ? "#F3F4F6"
                  : "#FEF3C7",
                color: position?.available
                  ? "#047857"
                  : posLoading
                  ? "#4B5563"
                  : "#92400E",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor">
                <path d="M7 1.5C4.8 1.5 3 3.3 3 5.5c0 3 4 7 4 7s4-4 4-7c0-2.2-1.8-4-4-4z" />
                <circle cx="7" cy="5.5" r="1.4" fill="white" />
              </svg>
              <span>
                {posLoading
                  ? "Getting your location…"
                  : position?.available
                  ? "Location ready — will be included"
                  : "Location unavailable — message will be sent without it"}
              </span>
            </div>

            {/* Contact send buttons */}
            <div className="space-y-2 mb-4">
              {pendingContacts.map((c) => {
                const sent = sentIds.has(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSendToContact(c)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors"
                    style={{
                      backgroundColor: sent ? "#ECFDF5" : "#fff",
                      borderColor: sent ? "#A7F3D0" : "#E5E7EB",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: sent ? "#10B981" : "#0D7377" }}
                    >
                      {sent ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2">
                          <path d="M3 7l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                          <path d="M8 1.5C4.4 1.5 1.5 4.3 1.5 7.7c0 1.2.4 2.4 1 3.4L1 14.5l3.6-1.4c1 .5 2.2.8 3.4.8 3.6 0 6.5-2.8 6.5-6.2C14.5 4.3 11.6 1.5 8 1.5z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-[14px] font-medium text-gray-900">
                        {c.name || "Contact"}
                      </div>
                      <div className="text-[11px] text-gray-500">{c.phone}</div>
                    </div>
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: sent ? "#047857" : "#0D7377" }}
                    >
                      {sent ? "Opened" : "Send"}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={closeConfirm}
              className="w-full py-3 rounded-xl text-[14px] font-semibold"
              style={{
                backgroundColor: allSent ? "#0D7377" : "#F3F4F6",
                color: allSent ? "white" : "#4B5563",
              }}
            >
              {allSent ? "Done" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* Fallback sheet when used standalone (no external handler) */}
      {!onOpenContactsSheet && (
        <TrustedContactsSheet
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onSaved={() => setSheetOpen(false)}
        />
      )}
    </>
  );
}
