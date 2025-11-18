import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Providers from "./_components/providers";
import { Spinner } from "./_components/spinner";
import { siteDescription, siteName } from "./_lib/const";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense
          fallback={
            <Spinner
              size={64}
              className="absolute top-1/2 left-1/2 -translate-1/2"
              variant="ring"
            />
          }
        >
          <Providers>
            {children}
            <Analytics />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
