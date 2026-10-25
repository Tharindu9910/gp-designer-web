"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { gsap, useGSAP, prefersReducedMotion, isMobile } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** 1 = scrolls with the page, >1 faster, <1 slower. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Moves the element relative to its natural scroll position while it crosses the viewport.
 * Travel = (speed - 1) × (viewport + element height).
 */
export default function Parallax({ children, speed = 1.2, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const s = isMobile() ? 1 + Math.min(speed - 1, 0.1) : speed;
      const travel = () => (s - 1) * (window.innerHeight + el.offsetHeight);
      gsap.fromTo(
        el,
        { y: () => travel() / 2 },
        {
          y: () => -travel() / 2,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={style} data-speed={speed}>
      {children}
    </div>
  );
}
