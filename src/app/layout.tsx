import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillTree AI - Your AI Career Operating System",
  description: "AI-powered career mentorship for students. Track skills, get personalized roadmaps, practice interviews, and land your dream job.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-slate-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
