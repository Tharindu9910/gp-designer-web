"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const bar = ref.current!;
    const setY = gsap.quickSetter(bar, "scaleY");
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setY(self.progress),
      onRefresh: (self) => setY(self.progress),
    });
    return () => st.kill();
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed right-0 top-0 z-[71] h-full w-[2px]">
      <div ref={ref} className="h-full w-full origin-top scale-y-0 bg-accent" />
    </div>
  );
}
