"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import MaskText from "@/components/motion/MaskText";
import TransitionLink from "@/components/motion/TransitionLink";
import { Accent } from "@/lib/accent";
import { media, type MediaKey } from "@/content/media.generated";

const rows: { keys: MediaKey[]; tone: "light" | "dark" }[] = [
  { keys: ["logo-wall/light-1", "logo-wall/light-2", "logo-wall/light-3"], tone: "light" },
  { keys: ["logo-wall/dark-1", "logo-wall/dark-2", "logo-wall/dark-3"], tone: "dark" },
];

/** Proof of range: two bands of the logo archive drifting in opposite directions with scroll. */
export default function LogoWall() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-wall-track]", ref.current).forEach((track, i) => {
        const travel = () => -(track.scrollWidth - window.innerWidth);
        gsap.fromTo(
          track,
          { x: i % 2 ? travel : 0 },
          {
            x: i % 2 ? 0 : travel,
            ease: "none",
            scrollTrigger: { trigger: track, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="overflow-clip pb-[18vh] pt-[8vh]" aria-labelledby="logo-archive">
      <div className="px-gutter">
        <div id="logo-archive" className="t-label mb-6 text-muted">
          Logo archive
        </div>
        <MaskText as="p" className="t-statement max-w-[30ch]">
          <Accent text="[200+ logos] for businesses in tea, gems, travel, health, food, fashion and education." />
        </MaskText>
      </div>

      <div className="mt-[8vh] space-y-3 md:space-y-4">
        {rows.map((row) => (
          <div
            key={row.tone}
            className={`overflow-x-auto [scrollbar-width:none] motion-safe:overflow-visible ${row.tone === "light" ? "bg-white" : "bg-[#05090c]"}`}
          >
            <div data-wall-track className="flex w-max">
              {row.keys.map((k) => {
                const m = media[k];
                return (
                  <div key={k} className="relative h-[clamp(120px,22vh,240px)] shrink-0" style={{ aspectRatio: `${m.w} / ${m.h}` }}>
                    <Image src={m.src} alt={m.alt} fill sizes="(max-width: 768px) 120vw, 70vw" className="object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[8vh] flex justify-center px-gutter">
        <TransitionLink
          href="/works"
          className="group flex items-center gap-2 rounded-full bg-accent py-1.5 pl-5 pr-1.5 text-sm font-medium text-on-accent"
        >
          See all work
          <span className="grid size-8 place-items-center rounded-full bg-dark text-accent transition-transform duration-300 group-hover:rotate-45">
            ↗
          </span>
        </TransitionLink>
      </div>
    </section>
  );
}
