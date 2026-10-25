"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import RuleDraw from "@/components/motion/RuleDraw";
import { site } from "@/content/site";

/** Three large numbers that count up as they enter. */
export default function Stats() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-count]", ref.current).forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { v: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
        });
      });
    },
    { scope: ref },
  );

  return (
    // A compact proof band: always three columns, divided by hairlines.
    <section ref={ref} className="px-gutter pb-[clamp(72px,12vh,160px)]">
      <RuleDraw />
      <dl className="grid grid-cols-3 pt-[clamp(24px,4vh,48px)]">
        {site.stats.map((s, i) => (
          <div key={s.label} className={i ? "border-l border-[var(--line)] pl-4 sm:pl-8 md:pl-10" : "pr-4"}>
            <dd className="display text-[clamp(2rem,7vw,7rem)]">
              <span data-count={s.value}>{s.value}</span>
              <span className="accent">{s.suffix}</span>
            </dd>
            <dt className="mt-2 text-xs leading-snug text-muted sm:text-sm md:mt-3 md:text-base">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
