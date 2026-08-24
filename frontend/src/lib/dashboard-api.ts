const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export function getDashboardKey() {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_DASHBOARD_SECRET ?? "";
  }
  return (
    localStorage.getItem("dashboard_key") ??
    process.env.NEXT_PUBLIC_DASHBOARD_SECRET ??
    ""
  );
}

export function setDashboardKey(key: string) {
  localStorage.setItem("dashboard_key", key);
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.auth !== false) {
    headers["x-dashboard-key"] = getDashboardKey();
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }
  return json.data as T;
}

export async function uploadFile(file: File): Promise<{ url: string; filename: string; originalName: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "x-dashboard-key": getDashboardKey(),
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Upload failed");
  }
  return json.data;
}



export const SECTIONS = [
  { id: "profile", label: "Profile", kind: "singleton", path: "/profile" },
  { id: "about", label: "About", kind: "singleton", path: "/about" },
  { id: "resume", label: "Resume", kind: "singleton", path: "/resume" },
  {
    id: "site-settings",
    label: "Site Settings",
    kind: "singleton",
    path: "/site-settings",
  },
  { id: "skills", label: "Skills", kind: "list", path: "/skills" },
  {
    id: "experiences",
    label: "Experiences",
    kind: "list",
    path: "/experiences",
  },
  { id: "education", label: "Education", kind: "list", path: "/education" },
  { id: "projects", label: "Projects", kind: "list", path: "/projects" },
  {
    id: "open-source",
    label: "Open Source",
    kind: "list",
    path: "/open-source",
  },
  {
    id: "social-links",
    label: "Social Links",
    kind: "list",
    path: "/social-links",
  },
  { id: "people", label: "People", kind: "list", path: "/people" },
  { id: "files", label: "Files", kind: "list", path: "/files" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const EMPTY_TEMPLATES: Record<string, Record<string, unknown>> = {
  skills: { label: "", color: "#60a5fa", sortOrder: 0, published: true },
  experiences: {
    company: "",
    role: "",
    employmentType: "Full-Time",
    location: "Dhaka",
    startDate: "",
    endDate: "Present",
    yearLabel: "",
    bullets: [],
    sortOrder: 0,
    published: true,
  },
  education: {
    year: "",
    place: "",
    title: "",
    detail: "",
    location: "",
    sortOrder: 0,
    published: true,
  },
  projects: {
    slug: "",
    title: "",
    year: "",
    startDate: "",
    endDate: "Present",
    description: "",
    highlights: [],
    stack: [],
    href: "",
    github: "",
    status: "live",
    accent: "#8b5cf6",
    emoji: "MdRocketLaunch",
    category: "portfolio",
    featured: true,
    sortOrder: 0,
    published: true,
  },
  "open-source": {
    slug: "",
    name: "",
    category: "Button",
    description: "",
    features: [],
    stack: [],
    preview: "button",
    accent: "#a78bfa",
    emoji: "FiTarget",
    github: "",
    sortOrder: 0,
    published: true,
  },
  "social-links": {
    label: "",
    href: "",
    platform: "",
    placement: "footer",
    sortOrder: 0,
    published: true,
  },
  people: {
    name: "",
    relation: "",
    imageUrl: "",
    bioParagraphs: [],
    focusTags: [],
    links: [],
    sortOrder: 0,
    published: true,
  },
  files: {
    name: "",
    type: "doc",
    href: "",
    downloadUrl: "",
    description: "",
    sortOrder: 0,
    published: true,
  },
};
