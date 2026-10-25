import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import TransitionProvider from "@/components/motion/TransitionProvider";
import PageShell from "@/components/layout/PageShell";
import TopBar from "@/components/chrome/TopBar";
import PillNav from "@/components/chrome/PillNav";
import SideTabs from "@/components/chrome/SideTabs";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import ViewLabel from "@/components/chrome/ViewLabel";
import { site } from "@/content/site";
import { theme, themeCss } from "@/theme/palette";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: `${site.name} is a Sri Lankan graphic designer. ${site.bio}`,
};

export const viewport: Viewport = { themeColor: theme.bg };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-chrome="light" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className={`${interTight.variable} antialiased`}>
        <SmoothScroll>
          <TransitionProvider>
            <PageShell>{children}</PageShell>
            <TopBar />
            <PillNav />
            <SideTabs />
            <ScrollProgress />
            <ViewLabel />
          </TransitionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
