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

const BASE_URL = "https://www.kaleidoo.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: "Kaleidoo — Skills-first hiring for neurodivergent talent",
  description:
    "Kaleidoo matches neurodivergent talent with inclusive employers through short, paid work trials — so people are hired on real skills, not interview performance.",
  keywords: [
    "neurodivergent hiring",
    "neurodiversity jobs",
    "skills-based hiring",
    "paid work trials",
    "inclusive recruitment",
    "autism employment",
    "ADHD jobs",
    "trial-based hiring",
    "neuroinclusive employer",
    "skills-first recruitment",
  ],
  authors: [{ name: "Kaleidoo", url: BASE_URL }],
  creator: "Kaleidoo",
  publisher: "Kaleidoo",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-GB": BASE_URL,
      en:      BASE_URL,
    },
  },

  openGraph: {
    type:        "website",
    siteName:    "Kaleidoo",
    title:       "Kaleidoo — Skills-first hiring for neurodivergent talent",
    description:
      "Hired for what you do, not how you interview. Kaleidoo matches neurodivergent talent with employers through short, paid work trials.",
    url:    BASE_URL,
    locale: "en_GB",
    alternateLocale: ["en_US"],
    images: [
      {
        url:    `${BASE_URL}/kaleidoo-social.png`,
        width:  1200,
        height: 630,
        alt:    "Kaleidoo — a colourful kaleidoscope marking skills-first, neuroinclusive hiring.",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    site:        "@kaleidoo",
    title:       "Kaleidoo — Skills-first hiring for neurodivergent talent",
    description:
      "Hired for what you do, not how you interview. Neurodivergent talent, matched to employers through short, paid work trials.",
    images: [`${BASE_URL}/kaleidoo-social.png`],
  },

  other: {
    "theme-color": "#FF6A2B",
  },
};

/* JSON-LD structured data */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":       "Organization",
      "@id":         `${BASE_URL}/#org`,
      name:          "Kaleidoo",
      url:           `${BASE_URL}/`,
      description:
        "A hiring platform where neurodivergent talent is matched to inclusive employers and hired on demonstrated work through short, paid trials.",
      sameAs: [
        "https://www.linkedin.com/company/kaleidoo",
        "https://twitter.com/kaleidoo",
      ],
    },
    {
      "@type":     "WebSite",
      "@id":       `${BASE_URL}/#website`,
      name:        "Kaleidoo",
      url:         `${BASE_URL}/`,
      inLanguage:  "en-GB",
      publisher:   { "@id": `${BASE_URL}/#org` },
    },
    {
      "@type":       "Service",
      name:          "Trial-based hiring for neurodivergent talent",
      serviceType:   "Skills-first recruitment platform",
      provider:      { "@id": `${BASE_URL}/#org` },
      areaServed:    "Worldwide",
      audience: {
        "@type":       "Audience",
        audienceType:  "Neurodivergent job seekers and inclusive employers",
      },
      description:
        "Employers post short, paid work trials; candidates are hired on demonstrated skills rather than interview performance.",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${bricolage.variable} ${atkinson.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="alternate" hrefLang="en-GB" href={BASE_URL} />
        <link rel="alternate" hrefLang="en"    href={BASE_URL} />
        <link rel="alternate" hrefLang="x-default" href={BASE_URL} />
      </head>
      <body>{children}</body>
    </html>
  );
}
