import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Wenrick | Full-Stack Web & Software Developer",
  description:
    "Enter Wenrick's Digital Workspace - An immersive, futuristic portfolio experience featuring cutting-edge web technologies.",
  keywords: ["portfolio", "full-stack developer", "web developer", "React", "Next.js", "Three.js"],
  openGraph: {
    title: "Wenrick | Full-Stack Web & Software Developer",
    description: "Enter Wenrick's Digital Workspace - A futuristic portfolio experience.",
    url: siteUrl,
    siteName: "Wenrick's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wenrick | Full-Stack Web & Software Developer",
    description: "Enter Wenrick's Digital Workspace - A futuristic portfolio experience.",
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
