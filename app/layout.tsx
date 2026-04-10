import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "first take — by riffle",
  description:
    "First Take. A live music event by Riffle. Bangalore, April 2026.",
  metadataBase: new URL("https://riffle.studio"),
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  openGraph: {
    title: "first take — by riffle",
    description:
      "First Take. A live music event by Riffle. Bangalore, April 2026.",
    url: "https://riffle.studio",
    siteName: "Riffle",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "first take — by riffle",
    description:
      "First Take. A live music event by Riffle. Bangalore, April 2026.",
    creator: "@riffledotstudio",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#eaeaec] dark:bg-[#1a1a1a] transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
