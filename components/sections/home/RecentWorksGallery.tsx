"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import TransitionLink from "@/components/motion/TransitionLink";
import { getProject } from "@/content/projects";
import { media, type MediaKey } from "@/content/media.generated";

type CardStyle = "photo" | "device" | "framed";

// 9 cards across the case studies, mixed presentation styles; ratios come from the real crops.
const recipe: { slug: string; key: MediaKey; style: CardStyle }[] = [
  { slug: "coop-fly", key: "coop-fly/signage", style: "photo" },
  { slug: "lotus-cosmic", key: "lotus-cosmic/laptop", style: "device" },
  { slug: "daladha", key: "daladha/board", style: "framed" },
  { slug: "logo-design", key: "logo-design/hansana", style: "photo" },
  { slug: "gome", key: "gome/grid", style: "device" },
  { slug: "packaging", key: "packaging/dhara", style: "framed" },
  { slug: "mongco", key: "mongco/grid", style: "photo" },
  { slug: "social-media", key: "social-media/samagi", style: "device" },
  { slug: "print", key: "print/embhode", style: "framed" },
];

const cards = recipe.map(({ slug, key, style }) => {
  const m = media[key];
  return { slug, title: getProject(slug)!.title, src: m.src, ratio: m.w / m.h, style };
});

const frame: Record<CardStyle, string> = {
  photo: "",
  device: "bg-pill p-[7%]",
  framed: "bg-fg p-2",
};

export default function RecentWorksGallery() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const startX = () => window.innerWidth;
        const endX = () => -(track.scrollWidth - window.innerWidth * 0.4);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => "+=" + (startX() - endX()),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(track, { x: startX }, { x: endX, ease: "none" }, 0).fromTo(
          track.querySelectorAll("[data-inner]"),
          { xPercent: -6 },
          { xPercent: 6, ease: "none" },
          0,
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative overflow-clip pb-[16vh] md:motion-safe:h-[100svh] md:motion-safe:pb-0"
      aria-labelledby="recent-works"
    >
      <h2
        id="recent-works"
        className="display relative z-0 px-gutter pb-8 text-center text-[clamp(2.6rem,6vw,6.4rem)] md:motion-safe:absolute md:motion-safe:inset-0 md:motion-safe:grid md:motion-safe:place-items-center md:motion-safe:pb-0"
      >
        Selected work
      </h2>
      <div
        ref={trackRef}
        className="relative z-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter [scrollbar-width:none] md:motion-safe:absolute md:motion-safe:left-0 md:motion-safe:top-1/2 md:motion-safe:-translate-y-1/2 md:motion-safe:snap-none md:motion-safe:overflow-visible md:motion-safe:px-0"
      >
        {cards.map((c, i) => (
          <TransitionLink
            key={i}
            href={`/works/${c.slug}`}
            flipSelector="[data-flip-src]"
            data-view
            aria-label={c.title}
            className="group block shrink-0 snap-start"
            style={{ height: "38vh", aspectRatio: String(c.ratio) }}
          >
            <div data-flip-src className={`relative h-full w-full overflow-hidden rounded-md ${frame[c.style]}`}>
              <div className="relative h-full w-full overflow-hidden rounded-[4px]">
                <div data-inner className="absolute inset-y-0 -left-[8%] w-[116%]">
                  <Image
                    src={c.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 70vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            </div>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}
