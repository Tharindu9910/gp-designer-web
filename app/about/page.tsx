import type { Metadata } from "next";
import AboutHero from "@/components/sections/about/AboutHero";
import Intro from "@/components/sections/about/Intro";
import Stats from "@/components/sections/about/Stats";
import Services from "@/components/sections/about/Services";
import Approach from "@/components/sections/about/Approach";
import Journey from "@/components/sections/about/Journey";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Intro />
      <Stats />
      <Services />
      {/* Light section slides over the sticky services panel */}
      <div className="relative z-[3] -mt-[var(--radius-panel)] rounded-t-[var(--radius-panel)] border-t border-line bg-bg">
        <Approach />
        <Journey />
      </div>
    </>
  );
}
