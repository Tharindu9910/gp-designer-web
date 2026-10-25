"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import RuleDraw from "@/components/motion/RuleDraw";
import type { Project } from "@/content/projects";

export default function ProjectBody({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-fade]", ref.current).forEach((el) =>
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }),
      );
    },
    { scope: ref },
  );

  const rows = [
    { label: "Brief", text: project.brief },
    { label: "Concept", text: project.concept },
    { label: "Delivered", text: project.delivered },
  ];

  return (
    <section ref={ref} className="px-gutter py-[18vh]">
      <p data-fade className="t-statement max-w-[28ch]">
        {project.summary}
      </p>
      {project.kind === "identity" && (
        <p data-fade className="t-label mt-6 text-accent-2">
          Creativity + meaning + professional and simple
        </p>
      )}
      <div className="mt-[12vh] space-y-16">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-12">
              <div className="t-label mb-3 text-muted">{r.label}</div>
              <RuleDraw />
            </div>
            <p data-fade className="text-lg leading-relaxed md:col-span-7 md:col-start-6 md:text-xl">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-[14vh] grid gap-12 md:grid-cols-12">
        <div data-fade className={project.palette ? "md:col-span-7" : "md:col-span-12"}>
          <div className="t-label mb-5 text-muted">Deliverables</div>
          <ul className="flex flex-wrap gap-2">
            {project.deliverables.map((d) => (
              <li key={d} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
                {d}
              </li>
            ))}
          </ul>
        </div>
        {project.palette && (
          <div data-fade className="md:col-span-4 md:col-start-9">
            <div className="t-label mb-5 text-muted">Brand colours</div>
            <ul className="flex flex-wrap gap-4">
              {project.palette.map((hex) => (
                <li key={hex} className="text-xs text-muted">
                  <span className="mb-2 block size-14 rounded-full ring-1 ring-[var(--line)]" style={{ background: hex }} />
                  {hex}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
