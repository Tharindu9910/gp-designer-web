"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/lib/useLenis";
import { site } from "@/content/site";

export default function QuickInfoDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const panel = panelRef.current!;
    const scrim = scrimRef.current!;
    if (open) {
      lenis.current?.stop();
      gsap.set([panel, scrim], { visibility: "visible" });
      gsap.to(scrim, { opacity: 1, duration: 0.4 });
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: "expo.out" });
      gsap.fromTo(
        panel.querySelectorAll("[data-item]"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, delay: 0.15, duration: 0.6, ease: "power3.out" },
      );
    } else {
      lenis.current?.start();
      gsap.to(scrim, { opacity: 0, duration: 0.3 });
      gsap.to(panel, {
        xPercent: 100,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => gsap.set([panel, scrim], { visibility: "hidden" }),
      });
    }
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div ref={scrimRef} onClick={onClose} className="invisible fixed inset-0 z-[94] bg-scrim opacity-0" />
      <aside
        ref={panelRef}
        role="dialog"
        aria-label="Quick info"
        aria-hidden={!open}
        className="invisible fixed inset-y-2 right-2 z-[95] flex w-[min(420px,calc(100vw-16px))] flex-col rounded-[var(--radius-panel)] bg-dark p-8 text-inverse"
      >
        <div className="flex items-center justify-between" data-item>
          <span className="t-label text-fg/60">Quick info</span>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-fg/10 text-lg" aria-label="Close">
            ×
          </button>
        </div>
        <div className="mt-10" data-item>
          <p className="text-3xl font-medium leading-tight tracking-tight">{site.name}</p>
          <p className="mt-2 text-lg leading-snug text-fg/60">Graphic designer and brand identity partner.</p>
        </div>
        <dl className="mt-10 divide-y divide-white/15 border-y border-fg/15">
          {site.quickInfo.map((row) => (
            <div key={row.label} className="flex justify-between gap-6 py-4 text-sm" data-item>
              <dt className="text-fg/60">{row.label}</dt>
              <dd className="text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto pt-10" data-item>
          <span className="t-label text-fg/60">Email</span>
          <a href={`mailto:${site.email}`} className="mt-2 block text-lg text-accent">
            {site.email}
          </a>
          <span className="t-label mt-6 block text-fg/60">WhatsApp</span>
          <a href={site.whatsapp.href} target="_blank" rel="noreferrer" className="mt-2 block text-lg text-accent">
            {site.whatsapp.label}
          </a>
        </div>
      </aside>
    </>
  );
}
