import { type Project } from "@/data/projects";

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  updated_at: string;
  archived: boolean;
  fork: boolean;
};

const ACCENTS = [
  "#8b5cf6",
  "#22d3ee",
  "#34d399",
  "#f472b6",
  "#fb923c",
  "#0ea5e9",
  "#fbbf24",
  "#a78bfa",
  "#f87171",
  "#2dd4bf",
];

const EMOJIS = ["🚀", "⚡", "🛠️", "💻", "🌐", "📦", "🎯", "✨", "🔧", "📱"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatTitle(name: string): string {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function inferCategory(
  name: string,
  language: string | null
): Project["category"] {
  const key = `${name} ${language ?? ""}`.toLowerCase();

  if (/ai|karially|potentialai|smart/.test(key)) return "ai";
  if (/dashboard|admin|studentia|statusboard|manager/.test(key)) return "dashboard";
  if (/portfolio|tofayel|me$/.test(key)) return "portfolio";
  if (/tool|toast|component|ui|tailwind|figtail|library|playground/.test(key))
    return "tool";

  return "platform";
}

function inferStack(language: string | null, name: string): string[] {
  const stack = new Set<string>();
  const key = name.toLowerCase();

  if (language) stack.add(language);
  if (/next|tofayel|me$|portfolio/.test(key)) stack.add("Next.js");
  if (/react/.test(key)) stack.add("React");
  if (/tailwind|figtail/.test(key)) stack.add("Tailwind CSS");
  if (/node|express|api/.test(key)) stack.add("Node.js");
  if (/django|python/.test(key)) stack.add("Python");
  if (/firebase/.test(key)) stack.add("Firebase");
  if (language === "TypeScript" || language === "JavaScript") {
    stack.add("TypeScript");
  }

  return Array.from(stack).slice(0, 5);
}

export function repoToProject(repo: GitHubRepo): Project {
  const hash = hashString(repo.name);
  const homepage = repo.homepage?.trim() || undefined;
  const hasLiveSite =
    !!homepage && !homepage.includes("github.com/YEL-59");

  return {
    slug: slugify(repo.name),
    title: formatTitle(repo.name),
    year: repo.updated_at.slice(0, 4),
    description:
      repo.description?.trim() ||
      `Open source project by YEL-59 — built with ${repo.language ?? "modern web tech"}.`,
    highlights: [
      repo.description?.trim() || "Built and maintained on GitHub",
      hasLiveSite ? "Live deployment available" : "Source code on GitHub",
      repo.archived ? "Archived repository" : "Actively maintained",
    ],
    stack: inferStack(repo.language, repo.name),
    href: hasLiveSite ? homepage : undefined,
    github: repo.html_url,
    status: repo.archived ? "archived" : hasLiveSite ? "live" : "archived",
    accent: ACCENTS[hash % ACCENTS.length],
    emoji: EMOJIS[hash % EMOJIS.length],
    category: inferCategory(repo.name, repo.language),
  };
}

export async function fetchGitHubRepos(
  username = "YEL-59"
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (page <= 5) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) break;

    const batch = (await response.json()) as GitHubRepo[];
    if (!Array.isArray(batch) || batch.length === 0) break;

    repos.push(...batch.filter((repo) => !repo.fork));
    if (batch.length < 100) break;
    page++;
  }

  return repos.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function mergeWithCuratedProjects(
  curated: Project[],
  repos: GitHubRepo[]
): Project[] {
  const curatedByGithub = new Map(
    curated
      .filter((project) => project.github)
      .map((project) => [project.github!.toLowerCase(), project])
  );

  const featured: Project[] = curated.map((project) => ({ ...project }));
  const usedGithub = new Set(
    featured
      .filter((project) => project.github)
      .map((project) => project.github!.toLowerCase())
  );
  const usedSlugs = new Set(featured.map((project) => project.slug));

  const rest = repos
    .filter((repo) => !usedGithub.has(repo.html_url.toLowerCase()))
    .map((repo) => {
      const curatedMatch = curatedByGithub.get(repo.html_url.toLowerCase());
      if (curatedMatch) return null;

      const generated = repoToProject(repo);
      if (usedSlugs.has(generated.slug)) return null;
      return generated;
    })
    .filter((project): project is Project => project !== null);

  return [...featured, ...rest];
}
