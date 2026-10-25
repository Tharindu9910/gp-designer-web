"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import ThemeSection from "@/components/motion/ThemeSection";
import MaskText from "@/components/motion/MaskText";
import { about } from "@/content/about";

/** Dark panel, rounded top and bottom; sticks while the next light section slides over it. */
export default function Services() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } });
      tl.from(q("[data-rule]"), { scaleX: 0, transformOrigin: "left center", duration: 0.8, stagger: 0.1, ease: "power3.out" }).from(
        q("[data-svc-text]"),
        { y: 24, opacity: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" },
        "-=0.3",
      );
    },
    { scope: ref },
  );

  return (
    // Sticky (and full-height) only where all six services fit on one screen.
    <ThemeSection className="relative z-[2] rounded-[var(--radius-panel)] border-y border-[var(--page-line)] [@media(min-width:1024px)_and_(min-height:740px)]:sticky [@media(min-width:1024px)_and_(min-height:740px)]:top-0">
      <div
        ref={ref}
        className="flex flex-col justify-center px-gutter py-[clamp(72px,12vh,140px)] [@media(min-width:1024px)_and_(min-height:740px)]:min-h-[100svh]"
      >
        <MaskText as="h2" className="t-statement text-center">
          {about.servicesHeading}
        </MaskText>
        <div className="mx-auto mt-[clamp(40px,8vh,96px)] grid w-full max-w-[1400px] gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-[clamp(40px,7vh,72px)]">
          {about.services.map((s) => (
            <div key={s.title}>
              <div className="flex items-center gap-3">
                <span data-svc-text className="text-[11px] tabular-nums text-fg/60">
                  {s.num}
                </span>
                <div data-rule className="h-px flex-1 bg-[var(--page-line)]" />
              </div>
              <h3 data-svc-text className="mt-4 text-xl font-medium tracking-tight md:mt-5 md:text-2xl xl:text-3xl">
                {s.title}
              </h3>
              <p data-svc-text className="mt-2 max-w-[38ch] text-sm leading-relaxed text-fg/70 md:mt-3">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ThemeSection>
  );
}
