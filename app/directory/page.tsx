"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { directory } from "@/lib/directory-data";
import DirectoryCard from "@/components/DirectoryCard";
import DirectoryFilters, { Filters } from "@/components/DirectoryFilters";

const DEFAULT_FILTERS: Filters = {
  search: "",
  type: "",
  spec: "",
  state: "",
  freeOnly: true,
};

export default function DirectoryPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const results = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return directory.filter((entry) => {
      if (q && !entry.name.toLowerCase().includes(q) && !entry.description.toLowerCase().includes(q)) return false;
      if (filters.type && entry.type !== filters.type) return false;
      if (filters.spec && !entry.specialisations.includes(filters.spec as never)) return false;
      if (filters.freeOnly && !entry.isFree) return false;
      if (filters.state) {
        const matchesState =
          entry.states.includes(filters.state) || entry.states.includes("All India");
        if (!matchesState) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div
      className="flex flex-col h-dvh"
      style={{ backgroundColor: "#F7F6F3", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-gray-200"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link
            href="/chat"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 14l-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <h1 className="font-semibold text-gray-900 text-[15px]">Find help near you</h1>
            <p className="text-xs text-gray-400">Free legal aid, NGOs, and helplines — verified and real</p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-lg w-full mx-auto flex-shrink-0">
        <DirectoryFilters
          filters={filters}
          onChange={setFilters}
          total={directory.length}
          shown={results.length}
        />
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-3 pb-24">
          {results.length > 0 ? (
            results.map((entry) => <DirectoryCard key={entry.id} entry={entry} />)
          ) : (
            <div className="text-center py-12 px-4">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-gray-600 text-sm font-medium mb-1">No results for these filters</p>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                Try removing a filter, or contact the national Women Helpline on{" "}
                <a href="tel:181" className="text-teal-600 font-semibold underline">181</a>
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-4 mb-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-[12px] text-amber-700 leading-relaxed">
              <span className="font-semibold">Note:</span> Haqq does not verify availability. Always call ahead to confirm. All contacts are external — Haqq never mediates or tracks communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
