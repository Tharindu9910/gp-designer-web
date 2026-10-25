"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import RuleDraw from "@/components/motion/RuleDraw";
import { getMedia, type LogoBrief } from "@/content/projects";

/** One row per logo: the mark on the left, the brief behind it on the right. */
export default function LogoBriefs({ briefs }: { briefs: LogoBrief[] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // individual triggers per row
      gsap.utils.toArray<HTMLElement>("[data-brief]", ref.current).forEach((el) =>
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="px-gutter pb-[16vh]">
      <div className="t-label mb-3 text-muted">The logos</div>
      <RuleDraw />
      <ol>
        {briefs.map((b, i) => {
          const logo = getMedia(b.logo);
          return (
            <li key={b.name}>
              <div data-brief className="grid items-center gap-8 py-10 md:grid-cols-12 md:py-14">
                <div className="relative overflow-hidden rounded-md md:col-span-5" style={{ aspectRatio: `${logo.w} / ${logo.h}` }}>
                  <Image src={logo.src} alt={logo.alt} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <span className="text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">{b.name}</h3>
                  <dl className="mt-6 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2 text-sm">
                    <dt className="text-muted">Industry</dt>
                    <dd>{b.industry}</dd>
                    <dt className="text-muted">Country</dt>
                    <dd>{b.country}</dd>
                    <dt className="text-muted">Concept</dt>
                    <dd className="leading-relaxed">{b.concept}</dd>
                  </dl>
                </div>
              </div>
              {i < briefs.length - 1 && <RuleDraw />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
