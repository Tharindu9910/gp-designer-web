import Hero from "@/components/sections/home/Hero";
import StatementReel from "@/components/sections/home/StatementReel";
import RecentWorksGallery from "@/components/sections/home/RecentWorksGallery";
import LogoWall from "@/components/sections/home/LogoWall";
import BgShift from "@/components/motion/BgShift";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Dark panel with rounded top slides over the sticky hero, then shifts to light. */}
      <BgShift
        shiftTrigger="[data-shift-trigger]"
        className="theme-dark relative z-[2] rounded-t-[var(--radius-panel)] border-t border-[var(--page-line)]"
      >
        <StatementReel />
        <RecentWorksGallery />
        <LogoWall />
      </BgShift>
    </>
  );
}
