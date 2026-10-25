import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, nextProject, projects } from "@/content/projects";
import ProjectHero from "@/components/sections/project/ProjectHero";
import ProjectBody from "@/components/sections/project/ProjectBody";
import ProjectGallery from "@/components/sections/project/ProjectGallery";
import LogoBriefs from "@/components/sections/project/LogoBriefs";
import NextProject from "@/components/sections/project/NextProject";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <ProjectHero project={project} />
      <ProjectBody project={project} />
      {project.briefs && <LogoBriefs briefs={project.briefs} />}
      <ProjectGallery project={project} />
      <NextProject project={nextProject(slug)} />
    </>
  );
}
