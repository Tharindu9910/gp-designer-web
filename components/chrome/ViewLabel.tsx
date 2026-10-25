"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** "View" pill that trails the pointer over any element with [data-view]. The system cursor stays. */
export default function ViewLabel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (!window.matchMedia("(hover: hover)").matches) return;
    gsap.set(el, { scale: 0, xPercent: 0, yPercent: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3.out" });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      x(e.clientX + 14);
      y(e.clientY + 14);
      const over = !!(e.target as Element | null)?.closest?.("[data-view]");
      if (over !== shown) {
        shown = over;
        gsap.to(el, { scale: over ? 1 : 0, duration: 0.3, ease: over ? "back.out(2)" : "power2.in", overwrite: "auto" });
      }
    };
    const hide = () => {
      shown = false;
      gsap.to(el, { scale: 0, duration: 0.2, overwrite: "auto" });
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", hide);
    window.addEventListener("click", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("click", hide);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="t-label pointer-events-none fixed left-0 top-0 z-[96] rounded-full bg-accent px-3.5 py-2 font-medium text-on-accent"
      style={{ transform: "scale(0)" }}
    >
      View
    </div>
  );
}
