import type { CSSProperties } from "react";
import Parallax from "@/components/motion/Parallax";
import ProjectCard from "./ProjectCard";
import WorksTitle from "./WorksTitle";
import { projects } from "@/content/projects";

// left / right / center-left / right-edge / left / right / …, ~55–60vh apart
const layout = [
  { left: 8, width: 26, speed: 1.25 },
  { left: 62, width: 26, speed: 1.15 },
  { left: 30, width: 26, speed: 1.35 },
  { left: 66, width: 28, speed: 1.2 },
  { left: 6, width: 27, speed: 1.3 },
  { left: 50, width: 28, speed: 1.18 },
  { left: 14, width: 26, speed: 1.28 },
  { left: 64, width: 26, speed: 1.2 },
  { left: 32, width: 28, speed: 1.32 },
];
const STEP_VH = 58;

export default function ScatterStream() {
  return (
    <section className="relative pt-[40vh]">
      <WorksTitle count={projects.length} />
      <div
        className="relative z-10 mt-[14vh] flex flex-col gap-16 px-gutter pb-[24vh] md:block md:h-[var(--h)] md:px-0 md:pb-0"
        style={{ "--h": `calc(${(projects.length - 1) * STEP_VH}vh + 34vw + 30vh)` } as CSSProperties}
      >
        {projects.map((p, i) => {
          const l = layout[i % layout.length];
          return (
            <Parallax
              key={p.slug}
              speed={l.speed}
              className="w-full md:absolute md:left-[var(--l)] md:top-[var(--t)] md:w-[var(--w)]"
              style={{ "--l": `${l.left}vw`, "--t": `${i * STEP_VH}vh`, "--w": `${l.width}vw` } as CSSProperties}
            >
              <ProjectCard project={p} priority={i < 2} />
            </Parallax>
          );
        })}
      </div>
    </section>
  );
}
