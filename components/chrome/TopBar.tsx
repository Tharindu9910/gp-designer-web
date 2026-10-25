"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/lib/useLenis";
import TransitionLink from "@/components/motion/TransitionLink";
import { site } from "@/content/site";

export function ContactPill({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-2 rounded-full bg-accent py-1.5 pl-4 pr-1.5 text-sm font-medium text-on-accent ring-1 ring-line"
    >
      Contact
      <span className="grid size-7 place-items-center rounded-full bg-dark text-accent transition-transform duration-300 group-hover:rotate-45">
        ↗
      </span>
    </button>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const nameRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  // On Home: the name is hidden over the hero and the contact pill hides once the hero is passed.
  useEffect(() => {
    const name = nameRef.current!;
    const contact = contactRef.current!;
    if (!isHome) {
      gsap.to(name, { autoAlpha: 1, y: 0, duration: 0.4 });
      gsap.to(contact, { yPercent: 0, autoAlpha: 1, duration: 0.4 });
      return;
    }
    gsap.set(name, { autoAlpha: 0, y: -10 });
    const st = ScrollTrigger.create({
      start: 0,
      end: () => window.innerHeight * 0.85,
      onLeave: () => {
        gsap.to(contact, { yPercent: -160, autoAlpha: 0, duration: 0.5, ease: "power3.out" });
        gsap.to(name, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" });
      },
      onEnterBack: () => {
        gsap.to(contact, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
        gsap.to(name, { autoAlpha: 0, y: -10, duration: 0.5, ease: "power3.out" });
      },
    });
    return () => st.kill();
  }, [isHome]);

  const toContact = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (lenis.current) lenis.current.scrollTo(max, { duration: 1.6 });
    else window.scrollTo({ top: max });
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex items-start justify-between px-gutter pt-5">
      <div ref={nameRef} className="pointer-events-auto">
        <TransitionLink href="/" className="chrome-ink text-sm font-medium tracking-tight">
          {site.name}
        </TransitionLink>
      </div>
      <div ref={contactRef} className="pointer-events-auto">
        <ContactPill onClick={toContact} />
      </div>
    </header>
  );
}
