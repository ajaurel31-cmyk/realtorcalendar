import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Realtor Content Calendar — Plan Your Social Media",
  description:
    "Generate a full month of social media posts, email ideas, and listing promotions for real estate agents. Plan, customize, and export your content calendar.",
  keywords: [
    "real estate",
    "content calendar",
    "social media",
    "realtor",
    "marketing",
    "instagram",
    "real estate agent",
  ],
  openGraph: {
    title: "Realtor Content Calendar",
    description:
      "214 ready-to-use social media templates for real estate agents. Generate, customize, and export a full month of content in minutes.",
    type: "website",
    locale: "en_US",
    siteName: "Realtor Content Calendar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realtor Content Calendar",
    description:
      "214 ready-to-use social media templates for real estate agents. Generate, customize, and export a full month of content in minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
