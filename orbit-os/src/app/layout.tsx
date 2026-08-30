import type { Metadata } from "next";
import { Inter, Playfair_Display, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Inter carries the product: every dashboard, form and control.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Playfair is the marketing voice only — landing headlines, always
// italic. High stroke contrast means it needs real size to work, so it
// never appears below display sizes and never inside the app UI.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["italic"],
  weight: ["500", "600", "700"],
});

// Instrument Serif carries the hero tagline. It ships a single 400 weight
// by design — the face gets its presence from size and contrast, not from
// bolding, so the hero sets it large and never tries to embolden it.
const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-tagline",
  display: "swap",
  style: ["italic"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Orbit",
  description: "Project management for freelancers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        inter.variable,
        playfair.variable,
        instrument.variable,
        "min-h-screen bg-background font-sans antialiased"
      )}>
        {children}
      </body>
    </html>
  );
}
