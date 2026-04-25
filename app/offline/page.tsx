import Link from "next/link";

const KEY_RIGHTS = [
  {
    title: "Right against domestic violence",
    body: "The Protection of Women from Domestic Violence Act 2005 covers physical, sexual, verbal, emotional, and economic abuse. You can apply for a Protection Order at any Magistrate's court — for free, with help from a Protection Officer.",
  },
  {
    title: "Right to maintenance",
    body: "Under Section 125 CrPC, a wife, child, or parent can claim monthly maintenance from a husband/father who has the means to pay but refuses. Courts can grant interim maintenance within 60 days.",
  },
  {
    title: "Right to free legal aid",
    body: "Every woman is entitled to free legal aid from the District Legal Services Authority (DLSA) regardless of income. Call the National Legal Services Authority helpline: 15100.",
  },
  {
    title: "Right against workplace harassment",
    body: "The POSH Act 2013 requires every employer with 10+ employees to have an Internal Complaints Committee. You can file a complaint within 3 months of the incident. Anonymous complaints are also accepted.",
  },
  {
    title: "Right to equal inheritance",
    body: "The Hindu Succession (Amendment) Act 2005 gives daughters equal rights as sons in ancestral property. This applies even if the father died before 2005, as long as the daughter was alive on 9 Sept 2005.",
  },
];

export default function OfflinePage() {
  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: "#F7F6F3", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="px-4 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M11 14l-5-5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <div>
          <div className="font-semibold" style={{ color: "#0D7377" }}>Haqq</div>
          <div className="text-xs text-gray-400">Key rights — offline</div>
        </div>
      </header>

      {/* Offline banner */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 text-[13px] text-amber-700 text-center">
        You&apos;re offline — Haqq can&apos;t answer new questions right now, but your{" "}
        <Link href="/directory" className="underline font-medium">directory</Link> still works
      </div>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <h1 className="text-[17px] font-semibold text-gray-900 mb-1">Key rights at a glance</h1>
        <p className="text-[13px] text-gray-400 mb-5">
          These apply to you even without internet.
        </p>

        <div className="space-y-3">
          {KEY_RIGHTS.map((right, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 px-4 py-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#0D7377" }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900 mb-1">{right.title}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{right.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-teal-50 rounded-2xl border border-teal-100 px-4 py-4">
          <p className="text-[13px] font-semibold text-teal-800 mb-1">Need help now?</p>
          <p className="text-[12px] text-teal-700 leading-relaxed">
            National Women Helpline: <span className="font-semibold">181</span>
            {" · "}Police: <span className="font-semibold">100</span>
            {" · "}NALSA Legal Aid: <span className="font-semibold">15100</span>
          </p>
        </div>
      </main>
    </div>
  );
}
