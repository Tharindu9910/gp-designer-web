"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, nextFrame, prefersReducedMotion, setChrome } from "@/lib/gsap";
import { useLenis } from "@/lib/useLenis";
import { site } from "@/content/site";
import { theme } from "@/theme/palette";

type NavigateOptions = { flipFrom?: HTMLElement | null; replace?: boolean };

type TransitionContextValue = {
  navigate: (href: string, opts?: NavigateOptions) => void;
  /** The route being navigated to (used by the nav pill to slide early). */
  pendingHref: string | null;
};

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => {}, pendingHref: null });
export const useTransition = () => useContext(TransitionContext);

const EASE = "power3.inOut";

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const waiter = useRef<{ path: string; resolve: () => void } | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Resolve the pending route swap once the new pathname has rendered.
  useEffect(() => {
    if (waiter.current && waiter.current.path === pathname) {
      waiter.current.resolve();
      waiter.current = null;
    }
  }, [pathname]);

  const swapRoute = useCallback(
    (href: string, replace?: boolean) =>
      new Promise<void>((resolve) => {
        const path = new URL(href, location.href).pathname;
        waiter.current = { path, resolve };
        if (replace) router.replace(href, { scroll: false });
        else router.push(href, { scroll: false });
      }),
    [router],
  );

  const resetScroll = useCallback(() => {
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [lenis]);

  const afterSwap = useCallback(async () => {
    await nextFrame();
    ScrollTrigger.refresh();
    lenis.current?.start();
    busy.current = false;
    setPendingHref(null);
  }, [lenis]);

  // The footer only travels with the page when part of it is revealed; otherwise it is hidden so
  // it can't show through the dimmed page. A dark body backdrop makes the opacity read as dimming.
  const pageEls = () => {
    const main = document.getElementById("main")!;
    const footer = document.getElementById("footer")!;
    const footerVisible = window.scrollY > ScrollTrigger.maxScroll(window) - footer.offsetHeight + 1;
    gsap.set(footer, { visibility: footerVisible ? "visible" : "hidden" });
    gsap.set(document.body, { backgroundColor: theme.backdrop });
    return footerVisible ? [main, footer] : [main];
  };
  const restorePage = () => {
    const els = [document.getElementById("main"), document.getElementById("footer")];
    gsap.set(els, { clearProps: "transform,opacity,visibility" });
    gsap.set(document.body, { clearProps: "backgroundColor" });
  };

  const navigate = useCallback(
    async (href: string, opts: NavigateOptions = {}) => {
      const targetPath = new URL(href, location.href).pathname;
      if (busy.current || (targetPath === pathname && !opts.replace)) return;
      busy.current = true;
      setPendingHref(targetPath);
      lenis.current?.stop();

      // Reduced motion: plain fade.
      if (prefersReducedMotion()) {
        resetScroll();
        await swapRoute(href, opts.replace);
        setChrome("light");
        return afterSwap();
      }

      // FLIP variant: clicked image expands toward the detail hero while the page fades.
      if (opts.flipFrom) {
        const src = opts.flipFrom;
        const rect = src.getBoundingClientRect();
        const clone = src.cloneNode(true) as HTMLElement;
        Object.assign(clone.style, {
          position: "fixed",
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          margin: "0",
          zIndex: "85",
          borderRadius: "6px",
          overflow: "hidden",
          transform: "none",
        });
        clone.querySelectorAll("img").forEach((img) => Object.assign(img.style, { transform: "none" }));
        document.body.appendChild(clone);
        document.documentElement.dataset.flipping = "";
        gsap.set(src, { visibility: "hidden" });

        const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter")) || 24;
        const tl = gsap.timeline();
        const faded = pageEls();
        gsap.set(document.body, { backgroundColor: "var(--bg)" });
        tl.to(faded, { opacity: 0, duration: 0.5, ease: "power2.out" }, 0);
        tl.to(
          clone,
          {
            left: gutter,
            top: window.innerHeight * 0.42,
            width: window.innerWidth - gutter * 2,
            height: window.innerHeight * 0.7,
            borderRadius: 28,
            duration: 0.9,
            ease: EASE,
          },
          0,
        );
        await tl;
        resetScroll();
        setChrome("light");
        await swapRoute(href, opts.replace);
        restorePage();
        gsap.from("#main", { opacity: 0, duration: 0.4, ease: "power2.out" });
        await nextFrame();
        const target = document.querySelector<HTMLElement>("[data-flip-target]");
        if (target) {
          const r = target.getBoundingClientRect();
          await gsap.to(clone, {
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            duration: 0.5,
            ease: "power3.out",
          });
        }
        delete document.documentElement.dataset.flipping;
        clone.remove();
        gsap.set(src, { clearProps: "visibility" });
        return afterSwap();
      }

      // Default: page lifts and dims while a rounded panel slides up over it.
      const panel = panelRef.current!;
      const tl = gsap.timeline();
      tl.to(pageEls(), { y: () => -window.innerHeight * 0.25, opacity: 0.6, duration: 0.7, ease: EASE }, 0.15);
      tl.fromTo(panel, { yPercent: 100, visibility: "visible" }, { yPercent: 0, duration: 0.7, ease: EASE }, 0.15);
      await tl;

      resetScroll();
      restorePage();
      setChrome("light");
      await swapRoute(href, opts.replace);
      gsap.set(panel, { visibility: "hidden" });
      return afterSwap();
    },
    [pathname, lenis, swapRoute, resetScroll, afterSwap],
  );

  // Browser back/forward: intercept before Next handles popstate and run the same transition.
  const navigateRef = useRef(navigate);
  const pathRef = useRef(pathname);
  navigateRef.current = navigate;
  pathRef.current = pathname;
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      // Router paths exclude the base path; location's include it.
      const path = location.pathname.slice((process.env.NEXT_PUBLIC_BASE_PATH ?? "").length) || "/";
      if (busy.current || path === pathRef.current) return;
      e.stopImmediatePropagation();
      navigateRef.current(path + location.search, { replace: true });
    };
    window.addEventListener("popstate", onPop, true);
    return () => window.removeEventListener("popstate", onPop, true);
  }, []);

  return (
    <TransitionContext.Provider value={{ navigate, pendingHref }}>
      {children}
      <div
        ref={panelRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] invisible rounded-t-[var(--radius-panel)] bg-bg"
      >
        <div className="flex items-start justify-between px-gutter pt-5">
          <span className="text-sm font-medium tracking-tight text-fg">{site.name}</span>
          <span className="flex items-center gap-2 rounded-full bg-accent py-1.5 pl-4 pr-1.5 text-sm font-medium text-on-accent ring-1 ring-line">
            Contact
            <span className="grid size-7 place-items-center rounded-full bg-dark text-accent">↗</span>
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
