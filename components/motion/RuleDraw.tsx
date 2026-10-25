"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** A 1px rule that draws left → right when it enters the viewport. */
export default function RuleDraw({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(ref.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return <div ref={ref} className={`h-px w-full bg-[var(--page-line)] ${className}`} />;
}
