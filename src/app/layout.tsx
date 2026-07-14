import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookStore | Premium Book Management & Discovery",
  description: "Curate your collection, discover new reads, and manage your library seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      localization={{
        signIn: {
          start: {
            title: "Sign in to BookStore",
          },
        },
        signUp: {
          start: {
            title: "Create your BookStore account",
          },
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-slate-900`}
        >
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

