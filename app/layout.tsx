import type { Metadata } from "next";
import { Bricolage_Grotesque, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaleidoo — Hiring, refracted",
  description:
    "Kaleidoo is a neurodiversity-first hiring platform that matches neurodivergent talent with employers through short, paid work trials. Get hired for what you can do, not how you interview.",
  metadataBase: new URL("https://www.kaleidoo.co.uk"),
  openGraph: {
    title: "Kaleidoo — Hiring, refracted",
    description:
      "Neurodivergent talent hired on demonstrated work, not interview performance. Short, paid trials. Real evidence.",
    url: "https://www.kaleidoo.co.uk",
    siteName: "Kaleidoo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaleidoo — Hiring, refracted",
    description:
      "Neurodivergent talent hired on demonstrated work, not interview performance. Short, paid trials. Real evidence.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${atkinson.variable}`}>
      <body>{children}</body>
    </html>
  );
}
