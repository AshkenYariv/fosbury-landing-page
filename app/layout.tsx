import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@/components/ui/Analytics";
import { SkipLink } from "@/components/ui/SkipLink";
import { copy } from "@/content/copy";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fosbury.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fosbury — AI-native ERP",
    template: "%s — Fosbury",
  },
  description: copy.meta.description,
  applicationName: "Fosbury",
  keywords: [
    "AI-native ERP",
    "consumer brands ERP",
    "perpetual ledger",
    "SKU margin",
    "close the books",
    "operating agents",
  ],
  authors: [{ name: "Fosbury" }],
  openGraph: {
    type: "website",
    title: copy.meta.title,
    description: copy.meta.description,
    url: SITE_URL,
    siteName: "Fosbury",
    images: [
      { url: "/api/og?variant=1", width: 1200, height: 630, alt: copy.meta.ogAlt },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.meta.title,
    description: copy.meta.description,
    images: ["/api/og?variant=1"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0F" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Fosbury",
      url: SITE_URL,
      description: copy.meta.description,
      logo: `${SITE_URL}/logo.svg`,
    },
    {
      "@type": "Product",
      "@id": `${SITE_URL}/#product`,
      name: "Fosbury ERP",
      brand: { "@id": `${SITE_URL}/#organization` },
      description: copy.meta.description,
      category: "Enterprise Resource Planning Software",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Fosbury",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      style={
        {
          "--font-sans": GeistSans.style.fontFamily,
          "--font-mono": GeistMono.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <body className="min-h-screen bg-bg font-sans text-primary antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SkipLink />
          {children}
          <Analytics />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
