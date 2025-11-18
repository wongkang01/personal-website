import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wong-kang.dev"),
  title: "Wong Kang · Product-focused Engineer",
  description:
    "Portfolio for Wong Kang — showcasing AI-infused, Next.js-powered products, internships, and award-winning projects.",
  icons: {
    icon: { url: "/images/logo.png", type: "image/png" },
    shortcut: { url: "/images/logo.png", type: "image/png" },
    apple: { url: "/images/logo.png", type: "image/png" },
  },
  openGraph: {
    title: "Wong Kang · Product-focused Engineer",
    description:
      "Exploring projects that combine AI, automation, and thoughtful UX across fintech, healthcare, and education.",
    url: "https://wong-kang.dev",
    siteName: "Wong Kang Portfolio",
    images: [{ url: "/images/profile_img.jpg", width: 1200, height: 630, alt: "Wong Kang" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wong Kang · Portfolio",
    description:
      "AI-forward engineer crafting Next.js products, GSAP-rich storytelling, and data platforms.",
    images: ["/images/profile_img.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="bg-[#050505] text-white">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
