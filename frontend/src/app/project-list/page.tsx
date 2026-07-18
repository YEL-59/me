import ProjectListSection from "@/components/project-list/ProjectListSection";
import { fetchPortfolioBundle } from "@/lib/portfolio-api";
import type { Project } from "@/data/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project list — Tofayel",
  description:
    "CMS project list with password-protected start, end, live, and repo details.",
};

export default async function ProjectListPage() {
  const bundle = await fetchPortfolioBundle();

  const projects: Project[] =
    bundle?.projects?.map((p) => ({
      _id: p._id,
      slug: p.slug,
      title: p.title,
      year: p.year,
      startDate: p.startDate,
      endDate: p.endDate,
      description: p.description,
      highlights: p.highlights ?? [],
      stack: p.stack ?? [],
      href: p.href,
      hasRepo: p.hasRepo,
      repoLocked: p.repoLocked,
      status: p.status,
      accent: p.accent ?? "#fbbf24",
      emoji: p.emoji ?? "📁",
      category: p.category,
    })) ?? [];

  return <ProjectListSection projects={projects} />;
}
