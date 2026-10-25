"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import TransitionLink from "@/components/motion/TransitionLink";
import { useTransition } from "@/components/motion/TransitionProvider";

const items = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "About", href: "/about" },
];

const activeIndex = (path: string) => {
  if (path.startsWith("/works")) return 1;
  if (path.startsWith("/about")) return 2;
  if (path === "/") return 0;
  return -1;
};

export default function PillNav() {
  const pathname = usePathname();
  const { pendingHref } = useTransition();
  const current = activeIndex(pendingHref ?? pathname);
  const pillRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const first = useRef(true);

  useLayoutEffect(() => {
    const pill = pillRef.current!;
    const place = (animate: boolean) => {
      const el = itemRefs.current[current];
      if (!el) return gsap.to(pill, { opacity: 0, duration: 0.2 });
      const vars = { x: el.offsetLeft, width: el.offsetWidth, opacity: 1 };
      if (animate) gsap.to(pill, { ...vars, duration: 0.4, ease: "power3.inOut" });
      else gsap.set(pill, vars);
    };
    place(!first.current);
    first.current = false;
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [current]);

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-pill p-1 shadow-2xl ring-1 ring-line"
      data-chrome-fade
    >
      <div className="relative flex">
        <span ref={pillRef} aria-hidden className="absolute inset-y-0 left-0 rounded-full bg-accent opacity-0" />
        {items.map((item, i) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            aria-current={i === current ? "page" : undefined}
            className={`t-label relative z-10 rounded-full px-5 py-2.5 font-medium transition-colors duration-300 ${
              i === current ? "text-on-accent" : "text-fg hover:text-accent-2"
            }`}
          >
            {item.label}
          </TransitionLink>
        ))}
      </div>
    </nav>
  );
}
