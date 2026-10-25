"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getMedia, type Project, type Shot as ShotData } from "@/content/projects";
import type { Media } from "@/content/media.generated";

/** One image at its real aspect ratio, with a scrubbed clip reveal + inner parallax. */
export function Shot({ media, sizes = "(max-width: 768px) 100vw, 90vw" }: { media: Media; sizes?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const shot = ref.current!;
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        shot,
        { clipPath: "inset(15% 0% 15% 0% round 6px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 6px)",
          ease: "none",
          scrollTrigger: { trigger: shot, start: "top bottom", end: "top 35%", scrub: true },
        },
      );
      gsap.fromTo(
        shot.querySelector("[data-shot-inner]"),
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: shot, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-md" style={{ aspectRatio: `${media.w} / ${media.h}` }}>
      <div data-shot-inner className="absolute inset-x-0 -inset-y-[5%]">
        <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

const cols = { full: "", half: "md:grid-cols-2", third: "grid-cols-2 md:grid-cols-3" };
const sizes = { full: "(max-width: 768px) 100vw, 1200px", half: "(max-width: 768px) 100vw, 50vw", third: "(max-width: 768px) 50vw, 33vw" };

/** Groups consecutive half / third shots into rows; full shots stand alone. */
function rows(gallery: ShotData[]) {
  const out: { span: keyof typeof cols; shots: ShotData[] }[] = [];
  for (const shot of gallery) {
    const span = shot.span ?? "full";
    const last = out[out.length - 1];
    const max = span === "half" ? 2 : span === "third" ? 3 : 1;
    if (last && last.span === span && last.shots.length < max) last.shots.push(shot);
    else out.push({ span, shots: [shot] });
  }
  return out;
}

export default function ProjectGallery({ project }: { project: Project }) {
  if (!project.gallery.length) return null;
  return (
    // capped width: the crops come from screenshots, so keep them near native size
    <section className="mx-auto max-w-[1200px] space-y-4 px-gutter md:space-y-6">
      {rows(project.gallery).map((row, i) => (
        <div key={i} className={`grid items-center gap-4 md:gap-6 ${cols[row.span]}`}>
          {row.shots.map((s) => (
            <Shot key={s.key} media={getMedia(s.key)} sizes={sizes[row.span]} />
          ))}
        </div>
      ))}
    </section>
  );
}
