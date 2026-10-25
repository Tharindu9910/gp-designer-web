"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { ScrollTrigger, useGSAP, setChrome } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

/** Dark section: applies dark color tokens and flips the fixed chrome while it sits under the top bar. */
export default function ThemeSection({ as: Tag = "section", children, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => setChrome(self.isActive ? "dark" : "light"),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`theme-dark page-colors ${className}`}>
      {children}
    </Tag>
  );
}
