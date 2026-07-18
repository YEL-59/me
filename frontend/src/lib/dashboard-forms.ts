import type { SectionId } from "@/lib/dashboard-api";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "password"
  | "color"
  | "select"
  | "stringList"
  | "objectList"
  | "icon";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  options?: { value: string; label: string }[];
  columns?: { key: string; label: string; type?: "text" | "icon" }[];
};

export const FORM_FIELDS: Partial<Record<SectionId, FieldDef[]>> = {
  profile: [
    { key: "displayName", label: "Display name", type: "text" },
    { key: "shortName", label: "Short name", type: "text" },
    { key: "handle", label: "Handle", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "avatarUrl", label: "Avatar URL", type: "text" },
    { key: "avatarInitial", label: "Avatar initial", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "website", label: "Website", type: "text" },
    { key: "collectionLabel", label: "Collection label", type: "text" },
    { key: "availabilityStatus", label: "Availability", type: "text" },
    { key: "yearsExperience", label: "Years experience", type: "text" },
    { key: "seoTitle", label: "SEO title", type: "text" },
    { key: "seoDescription", label: "SEO description", type: "textarea" },
    {
      key: "bioParagraphs",
      label: "Bio paragraphs",
      type: "stringList",
      hint: "One paragraph per line",
    },
    { key: "locationArea", label: "Location area", type: "text" },
    { key: "locationCity", label: "Location city", type: "text" },
    { key: "lat", label: "Latitude", type: "number" },
    { key: "lng", label: "Longitude", type: "number" },
    { key: "greeting", label: "Greeting", type: "text" },
    { key: "vaultOriginTitle", label: "Vault origin title", type: "text" },
    { key: "vaultOriginDetail", label: "Vault origin detail", type: "textarea" },
    { key: "vaultCurrentTitle", label: "Vault current title", type: "text" },
    {
      key: "vaultCurrentDetail",
      label: "Vault current detail",
      type: "textarea",
    },
    {
      key: "codeCardStack",
      label: "Code card stack",
      type: "stringList",
      hint: "One tech per line",
    },
  ],
  about: [
    { key: "pageTitle", label: "Page title", type: "text" },
    { key: "pageSubtitle", label: "Page subtitle", type: "textarea" },
    { key: "accent", label: "Accent color", type: "color" },
    {
      key: "introParagraphs",
      label: "Intro paragraphs",
      type: "stringList",
      hint: "One paragraph per line",
    },
    { key: "photoUrl", label: "Photo URL", type: "text" },
    { key: "handleBadge", label: "Handle badge", type: "text" },
    {
      key: "funFacts",
      label: "Fun facts",
      type: "objectList",
      columns: [
        { key: "emoji", label: "Icon", type: "icon" },
        { key: "label", label: "Label" },
        { key: "value", label: "Value" },
      ],
    },
    {
      key: "philosophies",
      label: "Philosophies",
      type: "stringList",
      hint: "One line per item",
    },
  ],
  resume: [
    { key: "pageTitle", label: "Page title", type: "text" },
    { key: "pageSubtitle", label: "Page subtitle", type: "textarea" },
    { key: "accent", label: "Accent color", type: "color" },
    {
      key: "summary",
      label: "Summary",
      type: "stringList",
      hint: "One paragraph per line",
    },
    {
      key: "skillGroups",
      label: "Skill groups",
      type: "objectList",
      columns: [
        { key: "group", label: "Group" },
        { key: "items", label: "Items" },
      ],
    },
    {
      key: "codingProfiles",
      label: "Coding profiles",
      type: "objectList",
      columns: [
        { key: "label", label: "Label" },
        { key: "href", label: "URL" },
      ],
    },
    { key: "pdfUrl", label: "PDF URL", type: "text" },
    { key: "texUrl", label: "TeX URL", type: "text" },
    { key: "latexRepoUrl", label: "LaTeX repo URL", type: "text" },
  ],
  "site-settings": [
    {
      key: "repoUnlockPassword",
      label: "Repo unlock password",
      type: "password",
      hint: "Used on /project-list to unlock start · end · live · repo",
    },
    {
      key: "repoUnlockTtlSeconds",
      label: "Unlock TTL (seconds)",
      type: "number",
      hint: "Auto-lock after unlock. Default 60. Min 10.",
    },
    { key: "vaultMasterPasscode", label: "Vault master passcode", type: "password" },
    { key: "availabilityBadge", label: "Availability badge", type: "text" },
    { key: "ambientTagline", label: "Ambient tagline", type: "text" },
    { key: "copyrightText", label: "Copyright text", type: "text" },
    { key: "githubUsername", label: "GitHub username", type: "text" },
    { key: "timezone", label: "Timezone", type: "text" },
    { key: "mapInviteLine", label: "Map invite line", type: "text" },
    { key: "mapFooterLine", label: "Map footer line", type: "text" },
    {
      key: "footerLinks",
      label: "Footer links",
      type: "objectList",
      columns: [
        { key: "label", label: "Label" },
        { key: "href", label: "URL" },
      ],
    },
    {
      key: "brandValues",
      label: "Brand values",
      type: "stringList",
      hint: "One value per line",
    },
    {
      key: "marqueeTrackA",
      label: "Marquee track A",
      type: "stringList",
      hint: "One item per line",
    },
    {
      key: "marqueeTrackB",
      label: "Marquee track B",
      type: "stringList",
      hint: "One item per line",
    },
    {
      key: "vaultHelpSteps",
      label: "Vault help steps",
      type: "objectList",
      columns: [
        { key: "icon", label: "Icon", type: "icon" },
        { key: "label", label: "Label" },
        { key: "text", label: "Text" },
      ],
    },
  ],
  skills: [
    { key: "label", label: "Label", type: "text" },
    { key: "color", label: "Color", type: "color" },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  experiences: [
    { key: "company", label: "Company", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "employmentType", label: "Employment type", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "startDate", label: "Start date", type: "text" },
    { key: "endDate", label: "End date", type: "text" },
    { key: "yearLabel", label: "Year label", type: "text" },
    {
      key: "bullets",
      label: "Bullets",
      type: "stringList",
      hint: "One bullet per line",
    },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  education: [
    { key: "year", label: "Year", type: "text" },
    { key: "place", label: "Place", type: "text" },
    { key: "title", label: "Title", type: "text" },
    { key: "detail", label: "Detail", type: "textarea" },
    { key: "location", label: "Location", type: "text" },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  projects: [
    { key: "slug", label: "Slug", type: "text", hint: "URL-safe id, e.g. studentia" },
    { key: "title", label: "Title", type: "text" },
    { key: "year", label: "Year", type: "text" },
    {
      key: "startDate",
      label: "Start date",
      type: "text",
      hint: "Locked on /project-list until unlock",
    },
    {
      key: "endDate",
      label: "End date",
      type: "text",
      hint: "Locked on /project-list until unlock",
    },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "highlights",
      label: "Highlights",
      type: "stringList",
      hint: "One highlight per line",
    },
    {
      key: "stack",
      label: "Stack",
      type: "stringList",
      hint: "One tech per line",
    },
    {
      key: "href",
      label: "Live link",
      type: "text",
      hint: "Locked on /project-list until unlock",
    },
    {
      key: "github",
      label: "Repo link",
      type: "text",
      hint: "Locked on /project-list until unlock",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "live", label: "Live" },
        { value: "nda", label: "NDA" },
        { value: "archived", label: "Archived" },
      ],
    },
    { key: "accent", label: "Accent color", type: "color" },
    {
      key: "emoji",
      label: "Icon",
      type: "icon",
      hint: "react-icons name (FiGithub) or emoji",
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "ai", label: "AI" },
        { value: "dashboard", label: "Dashboard" },
        { value: "portfolio", label: "Portfolio" },
        { value: "tool", label: "Tool" },
        { value: "platform", label: "Platform" },
      ],
    },
    { key: "featured", label: "Featured", type: "boolean" },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  "open-source": [
    { key: "slug", label: "Slug", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "category", label: "Category", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "features",
      label: "Features",
      type: "stringList",
      hint: "One feature per line",
    },
    {
      key: "stack",
      label: "Stack",
      type: "stringList",
      hint: "One tech per line",
    },
    {
      key: "preview",
      label: "Preview",
      type: "select",
      options: [
        { value: "button", label: "Button" },
        { value: "card", label: "Card" },
        { value: "navbar", label: "Navbar" },
        { value: "footer", label: "Footer" },
        { value: "breadcrumb", label: "Breadcrumb" },
        { value: "banner", label: "Banner" },
      ],
    },
    { key: "accent", label: "Accent color", type: "color" },
    {
      key: "emoji",
      label: "Icon",
      type: "icon",
      hint: "react-icons name (LuBot) or emoji",
    },
    { key: "github", label: "GitHub", type: "text" },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  "social-links": [
    { key: "label", label: "Label", type: "text" },
    { key: "href", label: "URL", type: "text" },
    { key: "platform", label: "Platform", type: "text" },
    {
      key: "placement",
      label: "Placement",
      type: "select",
      options: [
        { value: "footer", label: "Footer" },
        { value: "header", label: "Header" },
        { value: "both", label: "Both" },
      ],
    },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  people: [
    { key: "name", label: "Name", type: "text" },
    { key: "relation", label: "Relation", type: "text" },
    { key: "imageUrl", label: "Image URL", type: "text" },
    {
      key: "bioParagraphs",
      label: "Bio paragraphs",
      type: "stringList",
      hint: "One paragraph per line",
    },
    {
      key: "focusTags",
      label: "Focus tags",
      type: "stringList",
      hint: "One tag per line",
    },
    {
      key: "links",
      label: "Links",
      type: "objectList",
      columns: [
        { key: "label", label: "Label" },
        { key: "href", label: "URL" },
      ],
    },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  files: [
    { key: "name", label: "Name", type: "text" },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "doc", label: "Doc" },
        { value: "folder", label: "Folder" },
        { value: "pdf", label: "PDF" },
        { value: "ats", label: "ATS" },
      ],
    },
    { key: "href", label: "Href", type: "text" },
    { key: "downloadUrl", label: "Download URL", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
};

export function stripMeta(data: Record<string, unknown>) {
  const clean = { ...data };
  delete clean._id;
  delete clean.__v;
  delete clean.createdAt;
  delete clean.updatedAt;
  delete clean.isDeleted;
  return clean;
}
