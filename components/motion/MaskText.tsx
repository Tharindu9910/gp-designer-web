"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, fontsReady, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "load" reveals on mount, "scroll" when the element enters the viewport. */
  mode?: "load" | "scroll";
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
};

/** SplitText line mask reveal: yPercent 100 → 0, expo.out. */
export default function MaskText({
  as: Tag = "div",
  children,
  className,
  mode = "scroll",
  delay = 0,
  stagger = 0.1,
  duration = 0.9,
  start = "top 80%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { visibility: "visible" });
        return;
      }
      let split: SplitText | null = null;
      const run = contextSafe!(() => {
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            self.masks.forEach((m) => m.classList.add("split-mask"));
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, {
              yPercent: 100,
              duration,
              ease: "expo.out",
              stagger,
              delay: mode === "load" ? delay : 0,
              scrollTrigger: mode === "scroll" ? { trigger: el, start, once: true } : undefined,
            });
          },
        });
      });
      fontsReady().then(run);
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
