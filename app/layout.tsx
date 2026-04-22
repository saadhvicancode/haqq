import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haqq — Your rights. Plain and simple.",
  description:
    "A warm, honest legal guide for women in India. Tell Haqq what you're going through — in any language — and get clear guidance on your legal rights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
