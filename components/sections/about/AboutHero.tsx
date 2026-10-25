"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import MaskText from "@/components/motion/MaskText";
import DriftingRow from "./DriftingRow";
import { site } from "@/content/site";

export default function AboutHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to("[data-about-head]", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "60% top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative h-[100svh] overflow-x-clip">
      <div data-about-head className="flex h-[78svh] flex-col items-center justify-center px-gutter text-center">
        <MaskText as="h1" mode="load" delay={0.05} className="display t-hero">
          <span className="block">{site.aboutHero.line1}</span>
          <span className="block">{site.aboutHero.line2}</span>
        </MaskText>
        <MaskText as="p" mode="load" delay={0.3} className="mt-6 text-sm font-medium text-accent-2">
          {site.aboutHero.since}
        </MaskText>
      </div>
      <DriftingRow />
    </section>
  );
}
