"use client";

import { DirectoryEntry } from "@/lib/directory-data";

const TYPE_LABELS: Record<DirectoryEntry["type"], string> = {
  ngo: "NGO",
  helpline: "Helpline",
  sakhi: "Sakhi Centre",
  lawyer: "Lawyer",
};

const TYPE_COLORS: Record<DirectoryEntry["type"], { bg: string; text: string }> = {
  ngo:      { bg: "#CCFBF1", text: "#0F766E" },
  helpline: { bg: "#DBEAFE", text: "#1D4ED8" },
  sakhi:    { bg: "#EDE9FE", text: "#6D28D9" },
  lawyer:   { bg: "#FEF3C7", text: "#92400E" },
};

function openLink(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
}

interface Props {
  entry: DirectoryEntry;
}

export default function DirectoryCard({ entry }: Props) {
  const typeStyle = TYPE_COLORS[entry.type];

  const handleCall = () => openLink(`tel:${entry.phone}`);
  const handleWhatsApp = () => {
    const digits = entry.whatsapp!.replace(/\D/g, "");
    const phone = digits.length === 10 ? "91" + digits : digits;
    openLink(`https://wa.me/${phone}?text=${encodeURIComponent("Hi, I found your contact through Haqq. I need help.")}`);
  };
  const handleWebsite = () => {
    const url = entry.website!.startsWith("http") ? entry.website! : `https://${entry.website}`;
    openLink(url);
  };
  const handleEmail = () => openLink(`mailto:${entry.email}`);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      {/* Top row: badges */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
        >
          {TYPE_LABELS[entry.type]}
        </span>
        {entry.isFree && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
            Free
          </span>
        )}
        {entry.isVerified && (
          <span className="flex items-center gap-0.5 text-[11px] text-teal-600 font-medium">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" fill="#0D7377" />
              <path d="M3.5 6l1.8 1.8L8.5 4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified
          </span>
        )}
        {entry.states.includes("All India") && (
          <span className="text-[11px] text-gray-400 font-medium">All India</span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-gray-900 text-[15px] mb-1">{entry.name}</h3>

      {/* Description */}
      <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
        {entry.description}
      </p>

      {/* Languages */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {entry.languages.slice(0, 5).map((lang) => (
          <span
            key={lang}
            className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
          >
            {lang}
          </span>
        ))}
        {entry.languages.length > 5 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
            +{entry.languages.length - 5} more
          </span>
        )}
      </div>

      {/* Hours */}
      {entry.hours && (
        <p className="text-[12px] text-gray-400 mb-3 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="6" cy="6" r="5" />
            <path d="M6 3v3l2 1.5" strokeLinecap="round" />
          </svg>
          {entry.hours}
        </p>
      )}

      {/* Contact buttons */}
      <div className="flex flex-wrap gap-2">
        {entry.phone && (
          <button
            onClick={handleCall}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 3.5C2 3 2.5 2 3.5 2c.3 0 .6.2.8.4l2 2.5c.3.4.2.9-.1 1.2L5 7.3c.6 1 1.6 2 2.7 2.7l1.2-1.2c.3-.3.8-.4 1.2-.1l2.5 2c.3.2.4.5.4.8 0 1-.9 1.5-1.5 1.5C5.5 13 3 7 3 4c0-.2 0-.4-.1-.5L2 3.5z" />
            </svg>
            Call
          </button>
        )}
        {entry.whatsapp && (
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="#25D366">
              <path d="M8 1C4.1 1 1 4.1 1 8c0 1.2.3 2.4.9 3.4L1 15l3.7-.9C5.8 14.7 6.9 15 8 15c3.9 0 7-3.1 7-7s-3.1-7-7-7zm3.6 9.6c-.2.5-.9.9-1.5 1-.4.1-.9.1-2.7-.6-2.3-.9-3.8-3.2-3.9-3.3-.1-.2-.9-1.2-.9-2.3 0-1.1.6-1.6.8-1.9.2-.2.5-.3.7-.3h.4c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.1-.2.3-.1.4.4.7 1 1.3 1.6 1.7.4.3.9.5 1.3.6.2.1.3 0 .4-.1l.4-.5c.1-.2.3-.2.5-.1l1.7.8c.2.1.3.3.3.5v.4c0 .1 0 .2-.2.5z"/>
            </svg>
            WhatsApp
          </button>
        )}
        {entry.website && (
          <button
            onClick={handleWebsite}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 1.5c-2 2-3 4-3 6.5s1 4.5 3 6.5M8 1.5c2 2 3 4 3 6.5s-1 4.5-3 6.5M1.5 8h13" />
            </svg>
            Website
          </button>
        )}
        {entry.email && (
          <button
            onClick={handleEmail}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
              <path d="M1.5 5l6.5 4.5L14.5 5" />
            </svg>
            Email
          </button>
        )}
      </div>
    </div>
  );
}
