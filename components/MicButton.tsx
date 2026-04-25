"use client";

interface Props {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function MicButton({ isListening, onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Voice input"
      aria-pressed={isListening}
      title={isListening ? "Stop listening" : "Voice input"}
      className={`
        relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        ${isListening
          ? "bg-red-500 text-white shadow-lg"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"}
      `}
    >
      {/* Ripple rings when listening */}
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
          <span className="absolute inset-[-4px] rounded-full border border-red-300 animate-pulse opacity-40" />
        </>
      )}

      {/* Mic icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        <rect x="6" y="1" width="6" height="9" rx="3" />
        <path d="M3 9c0 3.3 2.7 6 6 6s6-2.7 6-6" />
        <line x1="9" y1="15" x2="9" y2="17" />
        <line x1="6" y1="17" x2="12" y2="17" />
      </svg>
    </button>
  );
}
