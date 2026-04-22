"use client";

import { useEffect, useState } from "react";

export const CONTACTS_KEY = "haqq_trusted_contacts";
const MAX = 3;

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  if (digits.startsWith("0") && digits.length === 11) return "91" + digits.slice(1);
  return digits;
}

function blank(): Contact {
  return { id: Math.random().toString(36).slice(2), name: "", phone: "+91 " };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (contacts: Contact[]) => void;
}

export default function TrustedContactsSheet({ isOpen, onClose, onSaved }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([blank()]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = JSON.parse(localStorage.getItem(CONTACTS_KEY) ?? "[]");
      setContacts(Array.isArray(stored) && stored.length > 0 ? stored : [blank()]);
    } catch {
      setContacts([blank()]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (id: string, field: keyof Contact, value: string) =>
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const remove = (id: string) =>
    setContacts((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));

  const handleSave = () => {
    const valid = contacts.filter((c) => c.name.trim() && c.phone.trim());
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(valid));
    onSaved(valid);
    onClose();
  };

  const handleTest = (c: Contact) => {
    const phone = formatPhone(c.phone);
    const text = encodeURIComponent(
      "Haqq Test: Hi, I added you as a trusted contact in Haqq safety app. Reply 'received' to confirm. (Ignore if unexpected.)"
    );
    const win = window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    if (!win) window.open(`sms:${c.phone}&body=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="relative bg-white rounded-t-2xl px-4 pt-3 pb-10 max-h-[88vh] overflow-y-auto"
        style={{ animation: "sheet-slide-up 0.25s ease-out" }}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[15px] font-semibold text-gray-900">Trusted Contacts</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Hold the SOS button for 2 seconds to send your location to these contacts via WhatsApp.
        </p>

        <div className="space-y-3 mb-4">
          {contacts.map((c) => (
            <div key={c.id} className="bg-gray-50 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={c.name}
                  onChange={(e) => update(c.id, "name", e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={() => remove(c.id)}
                  className="text-gray-300 hover:text-gray-500 p-1 flex-shrink-0"
                  aria-label="Remove contact"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2 2l11 11M13 2L2 13" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={c.phone}
                  onChange={(e) => update(c.id, "phone", e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={() => handleTest(c)}
                  disabled={!c.phone.trim() || c.phone.trim() === "+91"}
                  className="text-xs px-3 py-2 rounded-lg bg-white border border-gray-200 text-teal-700 font-medium disabled:opacity-40 whitespace-nowrap flex-shrink-0"
                >
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>

        {contacts.length < MAX && (
          <button
            onClick={() => setContacts((prev) => [...prev, blank()])}
            className="flex items-center gap-2 text-sm text-teal-700 font-medium mb-4"
          >
            <span className="w-5 h-5 rounded-full border-2 border-teal-700 flex items-center justify-center font-bold text-base leading-none">
              +
            </span>
            Add contact
          </button>
        )}

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "#0D7377" }}
        >
          Save contacts
        </button>

        <div className="flex items-center justify-center gap-1.5 mt-3">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="#9CA3AF">
            <path d="M6 1L1.5 3.5V6.5C1.5 9 3.5 11.2 6 11.7 8.5 11.2 10.5 9 10.5 6.5V3.5L6 1Z" />
          </svg>
          <span className="text-[11px] text-gray-400">Saved only on your device. Never shared.</span>
        </div>
      </div>
    </div>
  );
}
