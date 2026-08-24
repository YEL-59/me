import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CursorSpark from "@/components/CursorSpark";
import VisitTracker from "@/components/VisitTracker";
import { ThemeProvider } from "@/components/ThemeProvider";
import { fetchPortfolioBundle } from "@/lib/portfolio-api";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const bundle = await fetchPortfolioBundle();
  return {
    title: bundle?.profile?.seoTitle ?? "Tofayel — Frontend Developer",
    description:
      bundle?.profile?.seoDescription ?? "Frontend developer portfolio",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <CursorSpark />
          <VisitTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
