import TransitionLink from "@/components/motion/TransitionLink";
import MaskText from "@/components/motion/MaskText";
import type { Project } from "@/content/projects";

export default function NextProject({ project }: { project: Project }) {
  return (
    <section className="px-gutter pb-[16vh] pt-[22vh] text-center">
      <div className="t-label text-muted">Next project</div>
      <TransitionLink href={`/works/${project.slug}`} data-view className="group mt-6 inline-block">
        <MaskText as="span" className="display t-hero block transition-colors duration-300 group-hover:text-accent-2">
          {project.title}
        </MaskText>
      </TransitionLink>
    </section>
  );
}
