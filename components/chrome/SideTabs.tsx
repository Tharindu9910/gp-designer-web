"use client";

import { useCallback, useState } from "react";
import QuickInfoDrawer from "./QuickInfoDrawer";
import { site } from "@/content/site";

export default function SideTabs() {
  const [drawer, setDrawer] = useState(false);
  const [popover, setPopover] = useState(false);
  const close = useCallback(() => setDrawer(false), []);

  return (
    <>
      <div className="fixed right-0 top-1/2 z-[70] hidden -translate-y-1/2 flex-col gap-1 md:flex">
        <button
          onClick={() => setDrawer(true)}
          className="rounded-l-xl bg-pill px-2.5 py-5 text-fg ring-1 ring-line transition-[padding] hover:pr-4"
        >
          <span className="t-label block font-medium [writing-mode:vertical-rl] rotate-180">Quick info</span>
        </button>
        <div className="relative" onMouseEnter={() => setPopover(true)} onMouseLeave={() => setPopover(false)}>
          <button
            onClick={() => setPopover((v) => !v)}
            aria-expanded={popover}
            className="flex flex-col items-center gap-2 rounded-l-xl bg-dark px-2.5 py-5 text-inverse ring-1 ring-line transition-[padding] hover:pr-4"
          >
            <span className="size-1.5 rounded-full bg-accent ring-[3px] ring-accent/25" />
            <span className="t-label block font-medium [writing-mode:vertical-rl] rotate-180">Availability</span>
          </button>
          <div
            role="status"
            className={`absolute right-full top-1/2 mr-3 w-56 -translate-y-1/2 rounded-2xl bg-dark p-4 text-sm text-inverse shadow-xl ring-1 ring-line transition-all duration-300 ${
              popover ? "visible translate-x-0 opacity-100" : "invisible translate-x-2 opacity-0"
            }`}
          >
            <span className="t-label text-fg/60">Availability</span>
            <p className="mt-1">{site.availability}</p>
          </div>
        </div>
      </div>
      {/* Mobile: a single tab that opens the drawer */}
      <button
        onClick={() => setDrawer(true)}
        className="t-label fixed right-0 top-1/2 z-[70] -translate-y-1/2 rounded-l-xl bg-pill px-2 py-4 font-medium text-fg ring-1 ring-line md:hidden"
      >
        <span className="block [writing-mode:vertical-rl] rotate-180">Info</span>
      </button>
      <QuickInfoDrawer open={drawer} onClose={close} />
    </>
  );
}
