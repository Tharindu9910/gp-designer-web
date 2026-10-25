"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import TransitionLink from "@/components/motion/TransitionLink";

/** "404" whose characters drift away from the pointer. */
export default function NotFound() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const chars = Array.from(ref.current!.querySelectorAll<HTMLElement>("[data-char]"));
    const movers = chars.map((c) => ({
      el: c,
      x: gsap.quickTo(c, "x", { duration: 0.6, ease: "power3.out" }),
      y: gsap.quickTo(c, "y", { duration: 0.6, ease: "power3.out" }),
    }));
    const onMove = (e: PointerEvent) => {
      const radius = Math.min(window.innerWidth, 900) * 0.45;
      movers.forEach(({ el, x, y }) => {
        const r = el.getBoundingClientRect();
        // measure from the untransformed center
        const cx = r.left + r.width / 2 - Number(gsap.getProperty(el, "x"));
        const cy = r.top + r.height / 2 - Number(gsap.getProperty(el, "y"));
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.hypot(dx, dy) || 1;
        const push = Math.max(0, radius - dist) * 0.35;
        x((dx / dist) * push);
        y((dy / dist) * push);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section className="flex h-[100svh] flex-col items-center justify-center px-gutter text-center">
      <h1 ref={ref} className="display select-none text-[clamp(8rem,30vw,30rem)]" aria-label="404">
        {"404".split("").map((c, i) => (
          <span key={i} data-char aria-hidden className="inline-block">
            {c}
          </span>
        ))}
      </h1>
      <p className="mt-4 text-muted">This page wandered off.</p>
      <TransitionLink
        href="/"
        className="t-label mt-8 rounded-full bg-fg px-6 py-3.5 font-medium text-bg transition-colors hover:bg-accent-2"
      >
        Back home
      </TransitionLink>
    </section>
  );
}
