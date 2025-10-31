import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "cosmic-authentication";
import "./globals.css";

const primaryFont = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "RestorePro - Smart Xactimate Line Item Search",
  description: "AI-powered smart search for restoration professionals. Find the right line items for water, fire, mold, and rebuild projects."
};

export default function RootLayout({
  children


}: {children: React.ReactNode;}) {
  return (
    <html data-editor-id="app/layout.tsx:22:5" lang="en" className={primaryFont.className}>
      <body data-editor-id="app/layout.tsx:23:7" className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>);

}