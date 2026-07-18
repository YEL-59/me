export type PortfolioProfile = {
  displayName: string;
  shortName: string;
  handle: string;
  role: string;
  avatarUrl: string;
  avatarInitial: string;
  email: string;
  phone?: string;
  website?: string;
  collectionLabel?: string;
  availabilityStatus?: string;
  yearsExperience?: string;
  seoTitle?: string;
  seoDescription?: string;
  bioParagraphs?: string[];
  locationArea?: string;
  locationCity?: string;
  lat?: number;
  lng?: number;
  greeting?: string;
  vaultOriginTitle?: string;
  vaultOriginDetail?: string;
  vaultCurrentTitle?: string;
  vaultCurrentDetail?: string;
  codeCardStack?: string[];
};

export type PortfolioAbout = {
  pageTitle: string;
  pageSubtitle: string;
  accent?: string;
  introParagraphs: string[];
  photoUrl: string;
  handleBadge?: string;
  funFacts: { emoji: string; label: string; value: string }[];
  philosophies: string[];
};

export type PortfolioResume = {
  pageTitle: string;
  pageSubtitle: string;
  accent?: string;
  summary: string[];
  skillGroups: { group: string; items: string }[];
  codingProfiles: { label: string; href: string }[];
  pdfUrl?: string;
  texUrl?: string;
  latexRepoUrl?: string;
};

export type PortfolioSiteSettings = {
  footerLinks: { label: string; href: string }[];
  brandValues: string[];
  marqueeTrackA: string[];
  marqueeTrackB: string[];
  availabilityBadge: string;
  ambientTagline?: string;
  copyrightText: string;
  githubUsername: string;
  timezone: string;
  vaultMasterPasscode: string;
  repoUnlockTtlSeconds?: number;
  vaultHelpSteps: { icon: string; label: string; text: string }[];
  mapInviteLine?: string;
  mapFooterLine?: string;
};

export type PortfolioSkill = {
  _id: string;
  label: string;
  color: string;
};

export type PortfolioExperience = {
  _id: string;
  company: string;
  role: string;
  yearLabel?: string;
  startDate: string;
  endDate: string;
  bullets?: string[];
  employmentType?: string;
  location?: string;
};

export type PortfolioEducation = {
  _id: string;
  year: string;
  place: string;
  title: string;
  detail: string;
};

export type PortfolioProject = {
  _id: string;
  slug: string;
  title: string;
  year: string;
  startDate?: string;
  endDate?: string;
  description: string;
  highlights: string[];
  stack: string[];
  href?: string;
  github?: string;
  hasRepo?: boolean;
  repoLocked?: boolean;
  status: "live" | "nda" | "archived";
  accent: string;
  emoji: string;
  category: "ai" | "dashboard" | "portfolio" | "tool" | "platform";
};

export type PortfolioOpenSource = {
  _id: string;
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

export type PortfolioSocialLink = {
  _id: string;
  label: string;
  href: string;
  placement: string;
};

export type PortfolioPerson = {
  _id: string;
  name: string;
  relation: string;
  imageUrl: string;
  bioParagraphs: string[];
  focusTags: string[];
  links: { label: string; href: string }[];
};

export type PortfolioFile = {
  _id: string;
  name: string;
  type: "doc" | "folder" | "pdf" | "ats";
  href: string;
  downloadUrl?: string;
};

export type PortfolioBundle = {
  profile: PortfolioProfile | null;
  about: PortfolioAbout | null;
  resume: PortfolioResume | null;
  siteSettings: PortfolioSiteSettings | null;
  skills: PortfolioSkill[];
  experiences: PortfolioExperience[];
  education: PortfolioEducation[];
  projects: PortfolioProject[];
  openSource: PortfolioOpenSource[];
  socialLinks: PortfolioSocialLink[];
  people: PortfolioPerson[];
  files: PortfolioFile[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export async function fetchPortfolioBundle(): Promise<PortfolioBundle | null> {
  try {
    const res = await fetch(`${API_URL}/portfolio`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as PortfolioBundle) ?? null;
  } catch {
    return null;
  }
}
