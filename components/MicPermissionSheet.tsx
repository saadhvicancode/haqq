"use client";

interface Props {
  isOpen: boolean;
  onAllow: () => void;
  onDismiss: () => void;
}

export default function MicPermissionSheet({ isOpen, onAllow, onDismiss }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />

      <div
        className="relative bg-white rounded-t-2xl px-5 pt-3 pb-10"
        style={{ animation: "sheet-slide-up 0.25s ease-out" }}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#0D7377" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7.5" y="1" width="7" height="11" rx="3.5" />
              <path d="M3 11c0 4.4 3.6 8 8 8s8-3.6 8-8" />
              <line x1="11" y1="19" x2="11" y2="21" />
              <line x1="7" y1="21" x2="15" y2="21" />
            </svg>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-gray-900 mb-1">
              Speak instead of type
            </h2>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Haqq wants to use your microphone so you can speak instead of type.{" "}
              <strong className="text-gray-700 font-medium">
                Your voice is never recorded or stored
              </strong>{" "}
              — it&apos;s converted to text instantly on your device.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-medium hover:bg-gray-50 transition-colors"
          >
            No thanks
          </button>
          <button
            onClick={onAllow}
            className="flex-1 py-3 rounded-xl text-white text-[14px] font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0D7377" }}
          >
            Allow microphone
          </button>
        </div>
      </div>
    </div>
  );
}
