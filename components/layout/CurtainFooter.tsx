"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion, setChrome } from "@/lib/gsap";
import Socials from "@/components/chrome/Socials";
import { site } from "@/content/site";
import { media } from "@/content/media.generated";

export default function CurtainFooter() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  // Keep <main>'s bottom margin equal to the footer height so the curtain lines up exactly.
  useEffect(() => {
    const footer = ref.current!;
    const main = document.getElementById("main")!;
    const ro = new ResizeObserver(() => {
      main.style.marginBottom = `${footer.offsetHeight}px`;
      ScrollTrigger.refresh();
    });
    ro.observe(footer);
    return () => ro.disconnect();
  }, []);

  // Scrubbed reveal over the last footer-height of scroll; rebuilt per route.
  useEffect(() => {
    const footer = ref.current!;
    const ctx = gsap.context(() => {
      // Chrome turns light-on-dark once the footer fills the area under the top bar.
      ScrollTrigger.create({
        start: () => ScrollTrigger.maxScroll(window) - 40,
        end: "max",
        // no onLeave: reaching max scroll counts as "leaving" and would flip it back
        onEnter: () => setChrome("dark"),
        onLeaveBack: () => setChrome("light"),
      });
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          start: () => ScrollTrigger.maxScroll(window) - footer.offsetHeight,
          end: "max",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo("[data-footer-line]", { y: 60 }, { y: 0, ease: "none", stagger: 0.05 }, 0).fromTo(
        "[data-footer-avatar]",
        { scale: 0.8 },
        { scale: 1, ease: "none" },
        0,
      );
    }, footer);
    return () => ctx.revert();
  }, [pathname]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      /* clipboard may be unavailable; still show feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <footer
      id="footer"
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-0 flex h-[100svh] flex-col bg-dark px-gutter pb-24 pt-24 text-inverse md:pb-8"
    >
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {/* Lines sit tight together; the avatar straddles the seam, over line 1 and under line 2. */}
        <h2 className="display t-footer relative">
          <span data-footer-line className="relative z-0 block">
            Let&rsquo;s work
          </span>
          <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[58%]">
            <span
              data-footer-avatar
              className="relative block size-[clamp(60px,8.4vw,168px)] overflow-hidden rounded-full bg-[#d9d6d0] ring-1 ring-fg/20"
            >
              <Image src={media.avatar.src} alt="" fill sizes="168px" className="object-cover object-top grayscale" />
            </span>
          </span>
          <span data-footer-line className="relative z-20 block text-accent">
            together
          </span>
        </h2>

        <p className="mt-[8svh] text-base text-fg/60 md:text-lg">Drop me an email:</p>
        <div className="mt-2 flex items-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="display text-[clamp(1.5rem,2.7vw,2.8rem)] tracking-[-0.04em] transition-colors hover:text-accent"
          >
            {site.email}
          </a>
          <div className="relative">
            <button
              onClick={copy}
              aria-label="Copy email address"
              className="grid size-[clamp(2rem,2.6vw,2.75rem)] place-items-center rounded-lg bg-accent text-on-accent transition-transform hover:scale-105"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
            </button>
            <span
              role="status"
              className={`absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-full bg-fg px-2.5 py-1 text-xs text-bg transition-all duration-200 ${
                copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
            >
              {copied ? "Copied" : ""}
            </span>
          </div>
        </div>
        <a
          href={site.whatsapp.href}
          target="_blank"
          rel="noreferrer"
          className="mt-5 text-base text-fg/60 underline-offset-4 transition-colors hover:text-accent hover:underline md:text-lg"
        >
          or WhatsApp {site.whatsapp.label}
        </a>
      </div>

      <div className="flex flex-col-reverse items-start gap-4 text-sm text-fg/80 sm:flex-row sm:items-end sm:justify-between md:text-base">
        <span>©2026</span>
        <Socials tone="dark" />
      </div>
    </footer>
  );
}
