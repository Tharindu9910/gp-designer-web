import Image from "next/image";
import TransitionLink from "@/components/motion/TransitionLink";
import { getMedia, type Project, type Aspect } from "@/content/projects";

const aspectClass: Record<Aspect, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export default function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const cover = getMedia(project.cover);
  return (
    <TransitionLink
      href={`/works/${project.slug}`}
      flipSelector="[data-flip-src]"
      data-view
      className="group block"
    >
      <div data-flip-src className={`relative w-full overflow-hidden rounded-md bg-fg/5 ${aspectClass[project.aspect]}`}>
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 92vw, 26vw"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4 text-sm">
        <span className="font-medium tracking-tight">{project.title}</span>
        <span className="text-right text-xs text-muted">{project.services.join(" · ")}</span>
      </div>
    </TransitionLink>
  );
}
