import Link from "next/link";
import TopicCard from "@/components/TopicCard";

const topics = [
  {
    icon: "🏠",
    title: "Domestic Violence & Safety",
    description:
      "Protection orders, rights in the home, emergency steps you can take now.",
    topic: "domestic violence and safety",
  },
  {
    icon: "💼",
    title: "Workplace Harassment",
    description:
      "POSH Act rights, how to file with the ICC or LCC, what your employer must do.",
    topic: "workplace harassment",
  },
  {
    icon: "💍",
    title: "Marriage & Divorce",
    description:
      "Maintenance rights, divorce grounds, child custody, triple talaq.",
    topic: "marriage and divorce",
  },
  {
    icon: "🏡",
    title: "Property & Inheritance",
    description:
      "Equal ancestral rights, stridhan, matrimonial home protections.",
    topic: "property and inheritance",
  },
  {
    icon: "📱",
    title: "Cyber Harassment",
    description:
      "Non-consensual images, online stalking — what the law says and how to report.",
    topic: "cyber harassment",
  },
];

export default function LandingPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#F7F6F3", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="px-6 pt-12 pb-2 max-w-lg mx-auto">
        <div
          className="text-5xl font-semibold tracking-tight mb-1"
          style={{ color: "#0D7377" }}
        >
          Haqq
        </div>
        <div className="text-lg font-medium text-gray-700">
          Your rights. Plain and simple.
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-8 max-w-lg mx-auto">
        <p className="text-gray-600 text-base leading-relaxed mb-8">
          Tell Haqq what you&apos;re going through — in any language — and get
          clear, honest guidance on your legal rights.
        </p>

        <Link
          href="/chat"
          className="block w-full text-center text-white font-semibold text-base py-4 rounded-2xl transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#C4622D" }}
        >
          Start talking to Haqq →
        </Link>
      </section>

      {/* Topic cards */}
      <section className="px-6 pb-8 max-w-lg mx-auto">
        <div className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">
          I can help with
        </div>
        <div className="grid grid-cols-1 gap-3">
          {topics.map((t) => (
            <TopicCard key={t.topic} {...t} />
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <div className="px-6 py-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500 bg-white rounded-xl py-3 px-4 border border-gray-200">
          <span className="flex items-center gap-1.5">
            <span className="text-teal-600">✓</span> Free
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-teal-600">✓</span> Anonymous
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-teal-600">✓</span> No login required
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-6 max-w-lg mx-auto text-center">
        <p className="text-xs text-gray-400 leading-relaxed">
          Haqq is a guide, not a lawyer. For free legal representation contact{" "}
          <a
            href="https://nalsa.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "#0D7377" }}
          >
            NALSA at nalsa.gov.in
          </a>
        </p>
      </footer>
    </main>
  );
}
