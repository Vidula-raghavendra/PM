import type { Metadata } from "next";
import { Inter, Playfair_Display, Instrument_Sans } from "next/font/google";
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

// Instrument Sans carries the hero tagline: a geometric grotesque with
// tighter apertures than Inter, so it reads as a distinct voice at display
// size while staying in the sans family the product already uses.
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-tagline",
  display: "swap",
  weight: ["500", "600", "700"],
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
