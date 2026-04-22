"use client";

import { useState } from "react";

const groceryItems = [
  { name: "Aashirvaad Atta 5kg", qty: "₹289", img: "🌾" },
  { name: "Onions 2kg", qty: "₹48", img: "🧅" },
  { name: "Mother Dairy Dahi 500g", qty: "₹55", img: "🥛" },
  { name: "Toor Dal 1kg", qty: "₹140", img: "🫘" },
  { name: "Amul Butter 500g", qty: "₹265", img: "🧈" },
  { name: "Tomatoes 1kg", qty: "₹35", img: "🍅" },
  { name: "Potatoes 2kg", qty: "₹42", img: "🥔" },
  { name: "Surf Excel 1kg", qty: "₹215", img: "🧺" },
  { name: "Parle-G 800g", qty: "₹75", img: "🍪" },
  { name: "Haldiram Namkeen 400g", qty: "₹120", img: "🫙" },
  { name: "Basmati Rice 5kg", qty: "₹450", img: "🍚" },
  { name: "Coconut Oil 1L", qty: "₹185", img: "🥥" },
];

export default function PanicButton() {
  const [decoyActive, setDecoyActive] = useState(false);

  if (decoyActive) {
    return (
      <div
        className="fixed inset-0 z-50 bg-white"
        onClick={() => setDecoyActive(false)}
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {/* Big Bazaar style header */}
        <div className="bg-[#E8143C] text-white px-4 py-3 flex items-center gap-3">
          <div className="text-xl font-bold">Big Bazaar</div>
          <div className="text-xs opacity-80">Future Retail Ltd.</div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-xs">🔍</span>
            <span className="text-xs">🛒 3</span>
          </div>
        </div>

        <div className="bg-[#FFF3CD] px-4 py-2 text-xs text-[#856404] flex items-center gap-2">
          <span>🏷️</span>
          <span>Har Hafte Bachat Mela — Up to 40% off on staples!</span>
        </div>

        <div className="px-4 py-3">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            My Shopping List (12 items)
          </div>
          <div className="space-y-3">
            {groceryItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100"
              >
                <span className="text-2xl">{item.img}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">In Stock</div>
                </div>
                <div className="text-sm font-semibold text-[#E8143C]">
                  {item.qty}
                </div>
                <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Subtotal (12 items)</span>
              <span>₹1,919</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 mb-2">
              <span>Savings</span>
              <span>- ₹340</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>₹1,579</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-[#E8143C] text-white py-3 rounded-lg font-semibold text-sm">
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setDecoyActive(true)}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      title=""
      aria-label="Menu"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="11" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="11" width="5" height="5" rx="1" />
        <rect x="11" y="11" width="5" height="5" rx="1" />
      </svg>
    </button>
  );
}
