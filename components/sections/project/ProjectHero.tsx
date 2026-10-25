"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import MaskText from "@/components/motion/MaskText";
import { getMedia, type Project } from "@/content/projects";

export default function ProjectHero({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      if (prefersReducedMotion()) return;
      gsap.from(q("[data-meta]"), { y: 20, opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.3, ease: "power3.out" });
      // When arriving via the FLIP clone, the image is already in place; otherwise it rises in.
      if (!("flipping" in document.documentElement.dataset)) {
        gsap.from(q("[data-flip-target]"), { y: 60, opacity: 0, duration: 1.0, delay: 0.15, ease: "power3.out" });
      }
    },
    { scope: ref },
  );

  const cover = getMedia(project.cover);
  const meta = [
    { label: "Client", value: project.client },
    { label: "Industry", value: project.industry },
    { label: "Country", value: project.country },
    { label: "Services", value: project.services.join(", ") },
  ];

  return (
    <section ref={ref} className="px-gutter pt-[18vh]">
      <MaskText as="h1" mode="load" delay={0.05} className="display t-hero">
        {project.title}
      </MaskText>
      <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-5 text-sm md:grid-cols-4">
        {meta.map((m) => (
          <div key={m.label} data-meta>
            <div className="t-label text-muted">{m.label}</div>
            <div className="mt-1.5 font-medium tracking-tight">{m.value}</div>
          </div>
        ))}
      </div>
      {/* real aspect, capped so screenshot crops aren't blown up */}
      <div
        data-flip-target
        className="relative mx-auto mt-10 w-full max-w-[min(100%,1200px,calc(80svh*var(--r)))] overflow-hidden rounded-[var(--radius-panel)]"
        style={{ aspectRatio: `${cover.w} / ${cover.h}`, "--r": cover.w / cover.h } as CSSProperties}
      >
        <Image src={cover.src} alt={cover.alt} fill priority sizes="(max-width: 768px) 100vw, 1200px" className="object-cover" />
      </div>
    </section>
  );
}
