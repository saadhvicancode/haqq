import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const DISGUISES = {
  notes: {
    name: "My Notes",
    short_name: "Notes",
    description: "Personal notes app",
    icons: [
      { src: "/icons/notes-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icons/notes-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  },
  calculator: {
    name: "Calculator",
    short_name: "Calc",
    description: "Calculator app",
    icons: [
      { src: "/icons/calculator-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icons/calculator-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  },
  recipes: {
    name: "My Recipes",
    short_name: "Recipes",
    description: "Recipe collection",
    icons: [
      { src: "/icons/recipes-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icons/recipes-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  },
  budget: {
    name: "Budget Tracker",
    short_name: "Budget",
    description: "Personal budget tracker",
    icons: [
      { src: "/icons/budget-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icons/budget-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  },
} as const;

type DisguiseId = keyof typeof DISGUISES;

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("haqq_disguise")?.value ?? "notes";
  const id: DisguiseId = raw in DISGUISES ? (raw as DisguiseId) : "notes";
  const config = DISGUISES[id];

  const manifest = {
    ...config,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F6F3",
    theme_color: "#F7F6F3",
    orientation: "portrait",
    categories: ["productivity", "utilities"],
  };

  return NextResponse.json(manifest, {
    headers: { "Cache-Control": "no-store" },
  });
}
