import ProjectsShowcase from "@/components/projects/ProjectsShowcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Tofayel",
  description: "Showcase of Next.js, React, and AI projects by Md. Tofayel Islam.",
};

export default function ProjectPage() {
  return <ProjectsShowcase />;
}
