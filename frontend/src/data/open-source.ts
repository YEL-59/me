export type OpenSourceComponent = {
  slug: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  stack: string[];
  preview: "button" | "card" | "navbar" | "footer" | "breadcrumb" | "banner";
  accent: string;
  emoji: string;
  github?: string;
};

export const openSourceComponents: OpenSourceComponent[] = [
  {
    slug: "gradient-button",
    name: "Gradient Button",
    category: "Button",
    description: "Animated CTA with hover glow and loading state.",
    features: ["Variants", "Loading", "Icon slot", "TypeScript props"],
    stack: ["React", "TypeScript", "Tailwind"],
    preview: "button",
    accent: "#a78bfa",
    emoji: "🎯",
    github: "https://github.com/YEL-59",
  },
  {
    slug: "glass-card",
    name: "Glass Card",
    category: "Card",
    description: "Frosted glass bento card with theme-aware borders.",
    features: ["Dark/light", "Hover lift", "Slot API", "Responsive"],
    stack: ["React", "TypeScript", "Tailwind"],
    preview: "card",
    accent: "#22d3ee",
    emoji: "🧊",
    github: "https://github.com/YEL-59",
  },
  {
    slug: "minimal-navbar",
    name: "Minimal Navbar",
    category: "Navbar",
    description: "Sticky header with clock, theme toggle, and avatar.",
    features: ["Theme toggle", "Live clock", "Mobile ready", "Accessible"],
    stack: ["Next.js", "TypeScript", "Tailwind"],
    preview: "navbar",
    accent: "#34d399",
    emoji: "🧭",
    github: "https://github.com/YEL-59",
  },
  {
    slug: "bento-footer",
    name: "Bento Footer",
    category: "Footer",
    description: "Rounded footer bar with centered nav links.",
    features: ["Social links", "Value pills", "Rounded top", "Responsive"],
    stack: ["React", "TypeScript", "Tailwind"],
    preview: "footer",
    accent: "#fb923c",
    emoji: "👣",
    github: "https://github.com/YEL-59",
  },
  {
    slug: "slash-breadcrumb",
    name: "Slash Breadcrumb",
    category: "Breadcrumb",
    description: "Animated breadcrumb trail with page context.",
    features: ["Auto truncate", "Keyboard nav", "Custom separator", "ARIA"],
    stack: ["React", "TypeScript", "Tailwind"],
    preview: "breadcrumb",
    accent: "#f472b6",
    emoji: "🔗",
    github: "https://github.com/YEL-59",
  },
  {
    slug: "hero-banner",
    name: "Hero Banner",
    category: "Banner",
    description: "Gradient hero with badge, headline, and CTA row.",
    features: ["Gradient mesh", "Badge slot", "CTA group", "Motion safe"],
    stack: ["React", "TypeScript", "Tailwind"],
    preview: "banner",
    accent: "#fbbf24",
    emoji: "🚀",
    github: "https://github.com/YEL-59",
  },
];

export const componentCategories = [
  "All",
  "Button",
  "Card",
  "Navbar",
  "Footer",
  "Breadcrumb",
  "Banner",
] as const;
