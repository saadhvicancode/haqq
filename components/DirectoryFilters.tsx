"use client";

import { ALL_STATES } from "@/lib/directory-data";

export interface Filters {
  search: string;
  type: string;       // "" | "ngo" | "helpline" | "sakhi" | "lawyer"
  spec: string;       // "" | specialisation key
  state: string;      // "" | state name
  freeOnly: boolean;
}

const TYPE_CHIPS = [
  { label: "All",           value: "" },
  { label: "NGOs",          value: "ngo" },
  { label: "Helplines",     value: "helpline" },
  { label: "Sakhi Centres", value: "sakhi" },
  { label: "Lawyers",       value: "lawyer" },
];

const SPEC_CHIPS = [
  { label: "Domestic Violence", value: "domestic-violence" },
  { label: "Workplace / POSH",  value: "posh" },
  { label: "Divorce",           value: "divorce" },
  { label: "Property",          value: "property" },
  { label: "Cyber Crime",       value: "cyber" },
  { label: "Mental Health",     value: "mental-health" },
];

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  total: number;
  shown: number;
}

export default function DirectoryFilters({ filters, onChange, total, shown }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="bg-white border-b border-gray-200 flex-shrink-0">
      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"
          >
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3 3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search by name or keyword…"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Type chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar">
        {TYPE_CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => set({ type: chip.value })}
            className={`flex-shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-full transition-colors ${
              filters.type === chip.value
                ? "text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={filters.type === chip.value ? { backgroundColor: "#0D7377" } : {}}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Specialisation chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar">
        {SPEC_CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => set({ spec: filters.spec === chip.value ? "" : chip.value })}
            className={`flex-shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
              filters.spec === chip.value
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* State + Free toggle row */}
      <div className="flex items-center gap-3 px-4 pb-3">
        <select
          value={filters.state}
          onChange={(e) => set({ state: e.target.value })}
          className="flex-1 text-[13px] border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:border-teal-400"
        >
          <option value="">All states</option>
          {ALL_STATES.filter((s) => s !== "All India").map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button
          onClick={() => set({ freeOnly: !filters.freeOnly })}
          className={`flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg border transition-colors flex-shrink-0 ${
            filters.freeOnly
              ? "border-green-400 bg-green-50 text-green-700"
              : "border-gray-200 bg-white text-gray-600"
          }`}
        >
          {filters.freeOnly && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          Free only
        </button>
      </div>

      {/* Count */}
      <div className="px-4 pb-2">
        <p className="text-[12px] text-gray-400">
          {shown === total ? `${total} resources` : `${shown} of ${total} resources`}
        </p>
      </div>
    </div>
  );
}
