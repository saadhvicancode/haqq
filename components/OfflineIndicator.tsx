"use client";

import { useEffect, useState } from "react";

export default function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  return (
    <div className="relative group flex-shrink-0">
      <span
        className="block w-2 h-2 rounded-full"
        style={{ backgroundColor: online ? "#22C55E" : "#9CA3AF" }}
      />
      {!online && (
        <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 rounded-lg text-white text-[11px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: "rgba(15,15,15,0.85)" }}>
          Offline — chat unavailable
        </div>
      )}
    </div>
  );
}
