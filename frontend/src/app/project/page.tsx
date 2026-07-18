import ProjectsShowcase from "@/components/projects/ProjectsShowcase";
import {
  fetchGitHubRepos,
  mergeWithCuratedProjects,
} from "@/lib/github-projects";
import { fetchPortfolioBundle } from "@/lib/portfolio-api";
import type { Project } from "@/data/projects";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const bundle = await fetchPortfolioBundle();
  return {
    title: `Projects — ${bundle?.profile?.shortName ?? "Tofayel"}`,
    description:
      bundle?.profile?.seoDescription ??
      "Showcase of Next.js, React, and AI projects.",
  };
}

export default async function ProjectPage() {
  const bundle = await fetchPortfolioBundle();
  const githubUser = bundle?.siteSettings?.githubUsername ?? "YEL-59";
  const repos = await fetchGitHubRepos(githubUser);

  const curated: Project[] =
    bundle?.projects?.map((p) => ({
      _id: p._id,
      slug: p.slug,
      title: p.title,
      year: p.year,
      startDate: p.startDate,
      endDate: p.endDate,
      description: p.description,
      highlights: p.highlights,
      stack: p.stack,
      href: p.href,
      github: p.github,
      hasRepo: p.hasRepo,
      repoLocked: p.repoLocked,
      status: p.status,
      accent: p.accent,
      emoji: p.emoji,
      category: p.category,
    })) ?? [];

  const projects = mergeWithCuratedProjects(curated, repos);

  return <ProjectsShowcase projects={projects} />;
}
