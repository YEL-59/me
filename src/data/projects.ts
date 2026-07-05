export type Project = {
  slug: string;
  title: string;
  year: string;
  description: string;
  highlights: string[];
  stack: string[];
  href?: string;
  github?: string;
  status: "live" | "nda" | "archived";
  accent: string;
  emoji: string;
  category: "ai" | "dashboard" | "portfolio" | "tool" | "platform";
};

export const projects: Project[] = [
  {
    slug: "karially",
    title: "Karially.com",
    year: "2025",
    description:
      "AI-powered career platform for resume generation, cover letters, and goal tracking.",
    highlights: [
      "AI resume & cover letter generation",
      "Personalized dashboard with recommendations",
      "Auth, persistence, and secure API integration",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "ShadCN", "Node.js", "AI APIs"],
    href: "https://karially.com",
    status: "live",
    accent: "#8b5cf6",
    emoji: "🤖",
    category: "ai",
  },
  {
    slug: "studentia",
    title: "StudentIA",
    year: "2024",
    description:
      "Dynamic admin dashboard with real-time charts and modular CRUD workflows.",
    highlights: [
      "Real-time data visualization with Chart.js",
      "Responsive modular layout",
      "Admin-focused UX patterns",
    ],
    stack: ["React", "Chart.js", "Tailwind CSS"],
    href: "https://studentia.vercel.app",
    status: "live",
    accent: "#22d3ee",
    emoji: "📊",
    category: "dashboard",
  },
  {
    slug: "primeholiday",
    title: "Primeholiday",
    year: "2024",
    description:
      "Holiday package explorer — browse, create, and manage travel experiences.",
    highlights: [
      "Server state with React Query",
      "Package listing & management flows",
      "Optimized data fetching patterns",
    ],
    stack: ["React", "Tailwind CSS", "React Query", "Node.js"],
    href: "https://primeholiday.vercel.app",
    status: "live",
    accent: "#34d399",
    emoji: "✈️",
    category: "platform",
  },
  {
    slug: "portfolio-bento",
    title: "This Portfolio",
    year: "2025",
    description:
      "Mitchell Hou–inspired bento grid with physics skills, vault lock, and dotted map.",
    highlights: [
      "Matter.js draggable skill badges",
      "Paradox Engine passcode rituals",
      "Interactive dotted world map",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "Matter.js"],
    status: "live",
    accent: "#f472b6",
    emoji: "🎨",
    category: "portfolio",
  },
  {
    slug: "corona-kotha",
    title: "Corona Kotha",
    year: "2021",
    description:
      "COVID-19 tracker covering 180+ countries with verified API integration.",
    highlights: [
      "Real-time global data",
      "Country-level filtering",
      "Open source on GitHub",
    ],
    stack: ["JavaScript", "REST APIs", "Chart.js"],
    github: "https://github.com/YEL-59/corona-kotha",
    status: "archived",
    accent: "#fb923c",
    emoji: "🦠",
    category: "tool",
  },
  {
    slug: "softvence-clients",
    title: "Softvence Client Work",
    year: "2024",
    description:
      "Production React apps for agency clients — conversion-focused UI and scalable architecture.",
    highlights: [
      "Multi-client component systems",
      "Performance & accessibility audits",
      "Redux Toolkit + React Query patterns",
    ],
    stack: ["React", "TypeScript", "Redux", "Tailwind"],
    status: "nda",
    accent: "#a78bfa",
    emoji: "🏢",
    category: "platform",
  },
  {
    slug: "linkedin-clone",
    title: "LinkedIn Clone",
    year: "2021",
    description:
      "Full-stack social feed clone with auth, posts, and responsive profile layouts.",
    highlights: [
      "Weekly build challenge",
      "Component-driven architecture",
      "REST API integration",
    ],
    stack: ["React", "JavaScript", "CSS"],
    github: "https://github.com/YEL-59/linkend_clone",
    status: "archived",
    accent: "#0ea5e9",
    emoji: "💼",
    category: "platform",
  },
  {
    slug: "tofayel-vercel",
    title: "tofayel.vercel.app",
    year: "2024",
    description:
      "Personal branding site with animated hero, project showcase, and download CV flow.",
    highlights: [
      "Animated UI & design system",
      "Project filtering",
      "Performance optimized",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind"],
    href: "https://tofayel.vercel.app",
    status: "live",
    accent: "#fbbf24",
    emoji: "⚡",
    category: "portfolio",
  },
];

export const projectFilters = [
  { id: "all", label: "All work" },
  { id: "live", label: "Live" },
  { id: "ai", label: "AI" },
  { id: "dashboard", label: "Dashboard" },
  { id: "portfolio", label: "Portfolio" },
  { id: "archived", label: "Archived" },
] as const;

export type ProjectFilterId = (typeof projectFilters)[number]["id"];

export function filterProjects(filter: ProjectFilterId): Project[] {
  if (filter === "all") return projects;
  if (filter === "live") return projects.filter((p) => p.status === "live");
  if (filter === "archived") return projects.filter((p) => p.status === "archived");
  return projects.filter((p) => p.category === filter);
}
