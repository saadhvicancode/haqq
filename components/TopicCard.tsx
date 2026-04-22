"use client";

import { useRouter } from "next/navigation";

interface TopicCardProps {
  icon: string;
  title: string;
  description: string;
  topic: string;
}

export default function TopicCard({
  icon,
  title,
  description,
  topic,
}: TopicCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chat?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white rounded-2xl p-5 text-left border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all group active:scale-[0.98]"
    >
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-teal-700 transition-colors">
        {title}
      </div>
      <div className="text-xs text-gray-500 leading-relaxed">{description}</div>
    </button>
  );
}
