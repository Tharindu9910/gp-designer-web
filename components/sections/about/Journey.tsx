"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import RuleDraw from "@/components/motion/RuleDraw";
import { about } from "@/content/about";

export default function Journey() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // individual triggers per row
      gsap.utils.toArray<HTMLElement>("[data-value]", ref.current).forEach((el) =>
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="px-gutter pb-[clamp(96px,16vh,200px)] pt-[clamp(96px,16vh,200px)]">
      <div className="t-label mb-3 text-muted">Journey</div>
      <RuleDraw />
      <ol>
        {about.journey.map((j, i) => (
          <li key={j.title}>
            <div className="grid grid-cols-[2.5rem_1fr] gap-4 py-7 md:grid-cols-12 md:py-10">
              <span className="text-xs text-muted md:col-span-1">0{i + 1}</span>
              <div data-value className="md:col-span-9 md:col-start-4">
                <p className="t-statement">{j.title}</p>
                <p className="mt-3 text-sm text-muted">{j.detail}</p>
              </div>
            </div>
            {i < about.journey.length - 1 && <RuleDraw />}
          </li>
        ))}
      </ol>
    </section>
  );
}
