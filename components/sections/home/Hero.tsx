"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/lib/useLenis";
import Socials from "@/components/chrome/Socials";
import { site } from "@/content/site";
import { media } from "@/content/media.generated";

const portrait = media.portrait;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      if (prefersReducedMotion()) {
        gsap.set(q("[data-reveal]"), { visibility: "visible" });
        return;
      }
      gsap.set(q("[data-reveal]"), { visibility: "visible" });

      // Load sequence (seconds)
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(q("[data-hero-line]"), { yPercent: 100, duration: 1.0, ease: "expo.out", stagger: 0.12 }, 0)
        .from(q("[data-hero-portrait]"), { opacity: 0, y: 40, duration: 1.2, ease: "power3.out" }, 0.05)
        .from(q("[data-hero-fade]"), { opacity: 0, y: 12, duration: 0.8, ease: "power3.out", stagger: 0.05 }, 0.6);

      // The hero stays put (sticky); it eases back slightly as the dark panel covers it.
      gsap.to(q("[data-hero-inner]"), {
        scale: 0.96,
        opacity: 0.6,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-scroll-down]"), {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { start: 0, end: 160, scrub: true },
      });
    },
    { scope: ref },
  );

  const scrollDown = () => {
    if (lenis.current) lenis.current.scrollTo(window.innerHeight, { duration: 1.2 });
    else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="sticky top-0 z-0 h-[100svh] overflow-clip bg-bg">
      <div data-hero-inner className="relative flex h-full flex-col justify-center px-gutter will-change-transform md:pb-[10svh]">
        <h1 className="display t-hero relative z-20 w-full pt-[10svh] md:pt-0 md:text-[min(10.4vw,14rem)]!" data-reveal>
          <span data-hero-fade className="mb-4 block text-sm font-normal tracking-normal text-accent-2 md:mb-[3svh] md:pl-[0.08em] md:text-lg">
            {site.heroEyebrow}
          </span>
          <span className="block overflow-clip pb-[0.06em]">
            <span data-hero-line className="block">
              {site.heroLine1}
            </span>
          </span>
          {/* line 2 steps right and runs in front of the portrait's edge */}
          <span className="block overflow-clip pb-[0.06em] pl-[12vw]">
            <span data-hero-line className="block">
              {site.heroLine2}
            </span>
          </span>
          <span data-hero-fade className="mt-4 block pl-[12vw] text-sm font-normal tracking-normal text-fg/70 md:mt-[4svh] md:text-lg">
            <span className="inline-block max-w-[26ch] md:max-w-[32ch]">{site.heroSub}</span>
          </span>
        </h1>

        {/* Feathered photo: edges fade into the page so it reads as part of the background. */}
        <div
          data-hero-portrait
          className="pointer-events-none relative z-10 mx-auto mt-4 aspect-[620/984] h-[42svh] [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_22%,#000_78%,transparent),linear-gradient(to_bottom,transparent,#000_12%,#000_80%,transparent)] md:absolute md:bottom-0 md:right-[6vw] md:mt-0 md:h-[90svh] md:[mask-image:linear-gradient(to_right,transparent,#000_22%,#000_80%,transparent),linear-gradient(to_bottom,transparent,#000_10%)]"
        >
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            priority
            sizes="(max-width: 768px) 60vw, 40vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-[var(--gutter)] z-30 hidden items-center gap-8 md:flex">
        <button
          data-scroll-down
          onClick={scrollDown}
          aria-label="Scroll down"
          className="grid size-11 place-items-center rounded-full border border-fg/15 text-fg transition-colors hover:bg-accent hover:text-on-accent"
        >
          <span data-hero-fade>↓</span>
        </button>
        <dl data-hero-fade className="flex gap-8">
          {site.stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-medium leading-none tracking-tight text-accent-2">
                {s.value}
                {s.suffix}
              </dd>
              <dd className="mt-1 text-xs text-fg/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div data-hero-fade className="absolute bottom-6 right-[var(--gutter)] z-30 hidden md:block">
        <Socials />
      </div>
    </section>
  );
}
