import ProjectsShowcase from "@/components/projects/ProjectsShowcase";
import { curatedProjects } from "@/data/projects";
import {
  fetchGitHubRepos,
  mergeWithCuratedProjects,
} from "@/lib/github-projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Tofayel",
  description: "Showcase of Next.js, React, and AI projects by Md. Tofayel Islam.",
};

export default async function ProjectPage() {
  const repos = await fetchGitHubRepos("YEL-59");
  const projects = mergeWithCuratedProjects(curatedProjects, repos);

  return <ProjectsShowcase projects={projects} />;
}
