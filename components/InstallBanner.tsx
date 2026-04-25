"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function InstallBanner() {
  const { showBanner, install, dismiss } = usePWAInstall();

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
      style={{ animation: "sheet-slide-up 0.3s ease-out" }}
    >
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-t-2xl shadow-xl px-4 py-4">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#4F46E5" }}
          >
            {/* Notebook lines */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="7" width="16" height="2.5" rx="1.25" fill="white" opacity=".9"/>
              <rect x="3" y="11.5" width="16" height="2.5" rx="1.25" fill="white" opacity=".9"/>
              <rect x="3" y="16" width="10" height="2.5" rx="1.25" fill="white" opacity=".9"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-gray-900 mb-0.5">
              Add to your homescreen
            </p>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Works offline too — access your diary, directory, and rights info without internet.
            </p>
          </div>
          <button onClick={dismiss} className="text-gray-300 hover:text-gray-500 p-1 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 2l10 10M12 2L2 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={install}
            className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-semibold"
            style={{ backgroundColor: "#0D7377" }}
          >
            Add to homescreen
          </button>
          <button
            onClick={dismiss}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] text-gray-500"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
