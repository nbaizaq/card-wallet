import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Card Wallet";
const APP_DEFAULT_TITLE = "Card Wallet";
const APP_TITLE_TEMPLATE = "%s - Card Wallet";
const APP_DESCRIPTION = "A simple card wallet to store your cards";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const developerMode = process.env.NODE_ENV === "development";
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {!developerMode && <Script src="/register.js" strategy="beforeInteractive" />}
      </head>
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
