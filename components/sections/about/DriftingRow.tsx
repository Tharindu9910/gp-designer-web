"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { media, type MediaKey } from "@/content/media.generated";

const heights = [26, 36, 22, 40, 28, 34, 24, 38]; // svh, bottom-aligned
const keys: MediaKey[] = [
  "lotus-cosmic/logo",
  "daladha/board",
  "packaging/blackpanther",
  "coop-fly/logo-sheet",
  "mongco/grid",
  "social-media/maths",
  "packaging/milk",
  "lotus-cosmic/sign",
];
const srcs = keys.map((k) => media[k].src);

/** Row of cards cropped by the viewport bottom; drifts right → left while scrolling up with the page. */
export default function DriftingRow() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = ref.current!.children;
      gsap.from(cards, { y: 80, opacity: 0, duration: 1.1, stagger: 0.07, delay: 0.25, ease: "expo.out" });
      gsap.to(ref.current, {
        x: () => -window.innerWidth * 0.4,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="absolute -bottom-[8svh] left-[6vw] flex items-end gap-3 md:gap-4">
      {heights.map((h, i) => (
        <div
          key={i}
          className="relative w-[36vw] shrink-0 overflow-hidden rounded-md md:w-[15vw]"
          style={{ height: `${h}svh` }}
        >
          <Image src={srcs[i]} alt="" fill sizes="(max-width: 768px) 36vw, 15vw" className="object-cover" priority={i < 4} />
        </div>
      ))}
    </div>
  );
}
