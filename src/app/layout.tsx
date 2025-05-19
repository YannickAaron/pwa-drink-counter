import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { PWAProvider } from "./_components/PWAProvider";

export const metadata: Metadata = {
  title: "SipStats - Track Your Drinks",
  description: "Track your drinking habits and view detailed statistics with SipStats",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SipStats",
  },
};

export const viewport: Viewport = {
  themeColor: "#08415C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <head>
        <meta name="application-name" content="SipStats" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SipStats" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#08415C" />
        <script src="/sw-register.js" defer></script>
      </head>
      <body>
        <PWAProvider />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
