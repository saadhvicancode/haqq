import { cookies } from "next/headers";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import InstallBanner from "@/components/InstallBanner";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const DISGUISE_CONFIG = {
  notes:      { name: "My Notes",       icon: "notes" },
  calculator: { name: "Calculator",     icon: "calculator" },
  recipes:    { name: "My Recipes",     icon: "recipes" },
  budget:     { name: "Budget Tracker", icon: "budget" },
} as const;

type DisguiseId = keyof typeof DISGUISE_CONFIG;

function getDisguise(raw: string | undefined): typeof DISGUISE_CONFIG[DisguiseId] {
  return raw && raw in DISGUISE_CONFIG
    ? DISGUISE_CONFIG[raw as DisguiseId]
    : DISGUISE_CONFIG.notes;
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const { name } = getDisguise(cookieStore.get("haqq_disguise")?.value);

  return {
    title: name,
    description: "Personal app",
    manifest: "/api/manifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: name,
    },
    other: { "mobile-web-app-capable": "yes" },
  };
}

export const viewport: Viewport = {
  themeColor: "#F7F6F3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const { icon } = getDisguise(cookieStore.get("haqq_disguise")?.value);

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href={`/icons/${icon}-180.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`/icons/${icon}-180.png`} />
      </head>
      <body className="h-full antialiased">
        {children}
        <BottomNav />
        <InstallBanner />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
