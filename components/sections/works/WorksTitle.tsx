"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import MaskText from "@/components/motion/MaskText";

/** Sticky title that dims to ~45% as soon as scrolling starts. */
export default function WorksTitle({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      if (prefersReducedMotion()) return;
      gsap.from(q("[data-count]"), { opacity: 0, y: 10, duration: 0.6, delay: 0.4, ease: "power3.out" });
      gsap.to(ref.current, {
        opacity: 0.45,
        ease: "none",
        scrollTrigger: { start: 0, end: () => window.innerHeight * 0.3, scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="sticky top-[40vh] z-0 flex items-start justify-center px-gutter">
      <MaskText as="h1" mode="load" delay={0.1} className="display text-[clamp(3.2rem,11vw,12rem)]">
        Selected works
      </MaskText>
      <sup data-count className="ml-2 mt-[1vw] text-[clamp(0.9rem,1.4vw,1.5rem)] font-medium tracking-tight">
        ({String(count).padStart(2, "0")})
      </sup>
    </div>
  );
}
