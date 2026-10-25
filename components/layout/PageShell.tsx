import type { ReactNode } from "react";
import CurtainFooter from "./CurtainFooter";

/**
 * <main> sits above the fixed footer with a solid background and rounded bottom corners;
 * scrolling past its end slides it away to reveal the footer (margin set by CurtainFooter).
 * overflow: clip (not hidden) keeps position: sticky working inside.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <main
        id="main"
        className="relative z-[1] min-h-[100svh] overflow-clip rounded-b-[var(--radius-panel)] border-b border-line bg-bg"
        style={{ marginBottom: "100svh" }}
      >
        {children}
      </main>
      <CurtainFooter />
    </>
  );
}
