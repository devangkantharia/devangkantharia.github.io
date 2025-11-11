import { Montserrat } from 'next/font/google'

import type { Metadata } from "next";

import "@/app/globals.css";
import { StyleGlideProvider } from "@/components/styleglide-provider";
import { ThemeProvider } from "@/components/theme-provider";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
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
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
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
          <main className=''>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
