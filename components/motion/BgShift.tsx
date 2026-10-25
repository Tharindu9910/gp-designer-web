"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, setChrome, prefersReducedMotion } from "@/lib/gsap";
import { theme } from "@/theme/palette";

type Props = {
  children: ReactNode;
  className?: string;
  /** Selector (inside this wrapper) of the element whose scroll drives the dark → light shift. */
  shiftTrigger: string;
};

/**
 * Wrapper that starts with dark tokens and tweens --page-bg / --page-fg / --page-accent to the
 * light values (scrubbed over ~40vh) as `shiftTrigger` scrolls toward the top.
 */
export default function BgShift({ children, className = "", shiftTrigger }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const light = {
        "--page-bg": theme.bg,
        "--page-fg": theme.fg,
        "--page-accent": theme["accent-2"],
        "--page-line": theme.line,
      };
      const dark = {
        "--page-bg": theme.dark,
        "--page-fg": theme["fg-inverse"],
        "--page-accent": theme.accent,
        "--page-line": theme["line-dark"],
      };
      gsap.set(el, dark);

      // Chrome is dark from the moment the panel reaches the top bar until the shift is half done.
      let shiftProgress = 0;
      const enter = ScrollTrigger.create({
        trigger: el,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => setChrome(self.isActive && shiftProgress < 0.5 ? "dark" : "light"),
      });

      gsap.to(el, {
        ...light,
        ease: "none",
        immediateRender: false,
        duration: prefersReducedMotion() ? 0 : 1,
        scrollTrigger: {
          trigger: el.querySelector(shiftTrigger),
          start: "top 45%",
          end: () => `+=${window.innerHeight * 0.4}`,
          scrub: true,
          onUpdate: (self) => {
            shiftProgress = self.progress;
            if (enter.isActive) setChrome(self.progress < 0.5 ? "dark" : "light");
          },
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`page-colors ${className}`}>
      {children}
    </div>
  );
}
