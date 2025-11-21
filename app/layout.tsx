import "@/app/globals.css";

import { Montserrat } from 'next/font/google'
// import { DKEyes } from "@/components/dkeyes";
import Script from "next/script";

import { StyleGlideProvider } from "@/components/styleglide-provider";
import { ThemeProvider } from "@/components/theme-provider";
import TransitionProvider from "@/components/transitionProvider";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: import("next").Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://devangkantharia.com'),
  title: {
    default: "Devang Kantharia - Portfolio",
    template: "%s | Devang Kantharia",
  },
  description:
    "A New Media Designer and an Interaction Developer. National Institute of Design Alumni. Specializing in creating bespoke interactive digital experience.",
  keywords: [
    "Devnag Kantharia",
    "Portfolio",
    "Creative Technologist",
    "New Media Designer",
    "Creative",
    "Designer",
    "Design Researcher",
    "NID",
    "National Institute of Design",
    "National Institute of Design Alumni",
    "United Kingdom",
    "London",
    "India",
  ],
  authors: [{ name: "Devang Kantharia" }],
  creator: "Devang Kantharia",
  publisher: "Devang Kantharia",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  openGraph: {
    title: "Devang Kantharia - Portfolio",
    description:
      "A New Media Designer and an Interaction Developer. National Institute of Design Alumni. Specializing in creating bespoke interactive digital experience.",
    siteName: "DevangKantharia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Devang Kantharia - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devang Kantharia - Portfolio",
    description:
      "A New Media Designer and an Interaction Developer. National Institute of Design Alumni. Specializing in creating bespoke interactive digital experience.",
    images: ["/og-image.jpg"],
    creator: "@devangkantharia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://tweakcn.com/live-preview.min.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${montserrat.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StyleGlideProvider />
          {/* Interactive eyes in top-right */}
          {/* <DKEyes /> */}
          <TransitionProvider>{children}</TransitionProvider>
          {/* Pixelated cursor canvas overlay removed; now used per-canvas locally */}
        </ThemeProvider>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-83QEBPB7K4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-83QEBPB7K4');`}
        </Script>
      </body>
    </html>
  );
}
