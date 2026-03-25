import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roy Vivante — Full-Stack Developer",
  description:
    "Full-stack developer with a strong backend focus. I build production-ready systems, APIs, and polished web experiences. Explore my projects, tech stack, and experience.",
  keywords: [
    "Roy Vivante",
    "Full-Stack Developer",
    "Backend Engineer",
    "React",
    "Next.js",
    "Python",
    "Django",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Roy Vivante" }],
  openGraph: {
    title: "Roy Vivante — Full-Stack Developer",
    description:
      "Full-stack developer building production-ready systems, APIs, and web experiences.",
    type: "website",
    locale: "en_US",
    siteName: "Roy Vivante Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roy Vivante — Full-Stack Developer",
    description:
      "Full-stack developer building production-ready systems, APIs, and web experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
