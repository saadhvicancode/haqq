"use client";

import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const getSnapshot = () => navigator.onLine;
// Server snapshot — assume online during SSR. useSyncExternalStore guarantees
// the same value is used on the server and on the client's first render, so
// hydration cannot mismatch. After mount, React subscribes and switches to
// the live navigator.onLine value, re-rendering if it differs.
const getServerSnapshot = () => true;

export default function OfflineIndicator() {
  const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="relative group flex-shrink-0">
      <span
        className="block w-2 h-2 rounded-full"
        style={{ backgroundColor: online ? "#1D9E75" : "#9CA3AF" }}
      />
      <div
        className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 rounded-lg text-white text-[11px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: "rgba(15,15,15,0.85)" }}
      >
        {online ? "Online" : "Offline"}
      </div>
    </div>
  );
}
