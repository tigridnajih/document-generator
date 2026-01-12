import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business Document Generator",
  description: "Create professional proposals, quotations, and invoices instantly.",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Business Document Generator",
    description: "Create professional proposals, quotations, and invoices instantly.",
    url: "https://document-generate-form.vercel.app",
    siteName: "Tigrid Technologies",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tigrid Business Document Generator",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Business Document Generator",
    description: "Create professional proposals, quotations, and invoices instantly.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}