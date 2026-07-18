"use client";

import type { IconType } from "react-icons";
import * as Bi from "react-icons/bi";
import * as Fa from "react-icons/fa";
import * as Fi from "react-icons/fi";
import * as Hi from "react-icons/hi2";
import * as Lu from "react-icons/lu";
import * as Md from "react-icons/md";
import * as Si from "react-icons/si";
import * as Tb from "react-icons/tb";

const PACKS: Record<string, Record<string, IconType>> = {
  Fi: Fi as Record<string, IconType>,
  Md: Md as Record<string, IconType>,
  Fa: Fa as Record<string, IconType>,
  Hi: Hi as Record<string, IconType>,
  Bi: Bi as Record<string, IconType>,
  Lu: Lu as Record<string, IconType>,
  Si: Si as Record<string, IconType>,
  Tb: Tb as Record<string, IconType>,
};

/** Curated list for the dashboard picker (type any react-icons name too). */
const ICON_CATALOG_RAW = [
  "FiHome",
  "FiUser",
  "FiMail",
  "FiGithub",
  "FiLinkedin",
  "FiGlobe",
  "FiLink",
  "FiExternalLink",
  "FiCode",
  "FiTerminal",
  "FiCpu",
  "FiDatabase",
  "FiLayers",
  "FiLayout",
  "FiGrid",
  "FiBox",
  "FiPackage",
  "FiTool",
  "FiSettings",
  "FiStar",
  "FiHeart",
  "FiZap",
  "FiSun",
  "FiMoon",
  "FiCloud",
  "FiCamera",
  "FiImage",
  "FiVideo",
  "FiMusic",
  "FiBook",
  "FiBookmark",
  "FiBriefcase",
  "FiAward",
  "FiMapPin",
  "FiNavigation",
  "FiCompass",
  "FiCalendar",
  "FiClock",
  "FiCheck",
  "FiCheckCircle",
  "FiAlertCircle",
  "FiInfo",
  "FiLock",
  "FiUnlock",
  "FiKey",
  "FiEye",
  "FiEyeOff",
  "FiSearch",
  "FiFilter",
  "FiDownload",
  "FiUpload",
  "FiShare2",
  "FiSend",
  "FiMessageCircle",
  "FiPhone",
  "FiSmartphone",
  "FiTablet",
  "FiMonitor",
  "FiServer",
  "FiWifi",
  "FiBluetooth",
  "FiBattery",
  "FiActivity",
  "FiBarChart2",
  "FiPieChart",
  "FiTrendingUp",
  "FiTarget",
  "FiFlag",
  "FiGift",
  "FiCoffee",
  "FiShoppingBag",
  "FiShoppingCart",
  "FiTruck",
  "FiMap",
  "FiUsers",
  "FiUserPlus",
  "FiFile",
  "FiFileText",
  "FiFolder",
  "FiFolderPlus",
  "FiEdit",
  "FiEdit2",
  "FiTrash2",
  "FiPlus",
  "FiMinus",
  "FiX",
  "FiArrowRight",
  "FiArrowUpRight",
  "FiRefreshCw",
  "FiRepeat",
  "FiPlay",
  "FiPause",
  "FiSlash",
  "MdRocketLaunch",
  "MdSchool",
  "MdWork",
  "MdScience",
  "MdPsychology",
  "MdPalette",
  "MdDesignServices",
  "MdAutoAwesome",
  "MdBolt",
  "MdSecurity",
  "MdVpnKey",
  "MdTravelExplore",
  "MdFlight",
  "MdHotel",
  "MdRestaurant",
  "MdLocalCafe",
  "MdSportsEsports",
  "MdSmartToy",
  "MdAnalytics",
  "MdDashboard",
  "MdStorage",
  "MdCloud",
  "MdCode",
  "MdTerminal",
  "MdBugReport",
  "MdBuild",
  "MdExtension",
  "MdLightbulb",
  "MdFavorite",
  "MdStar",
  "MdPublic",
  "MdLanguage",
  "MdTranslate",
  "LuBrain",
  "LuSparkles",
  "LuWandSparkles",
  "LuBot",
  "LuBlocks",
  "LuComponent",
  "LuBraces",
  "LuBinary",
  "LuOrbit",
  "LuRadar",
  "LuGauge",
  "LuFingerprint",
  "LuShield",
  "LuShieldCheck",
  "LuCrown",
  "LuGem",
  "LuPalette",
  "LuBrush",
  "LuPenTool",
  "LuMousePointerClick",
  "LuAppWindow",
  "LuPanelTop",
  "LuPanelsTopLeft",
  "SiReact",
  "SiNextdotjs",
  "SiTypescript",
  "SiJavascript",
  "SiTailwindcss",
  "SiNodedotjs",
  "SiMongodb",
  "SiPostgresql",
  "SiFirebase",
  "SiVercel",
  "SiGithub",
  "SiGitlab",
  "SiFigma",
  "SiFramer",
  "SiRedux",
  "SiGraphql",
  "SiDocker",
  "SiPython",
  "TbBrandTypescript",
  "TbBrandNextjs",
  "TbBrandReact",
  "TbBrandGithub",
  "TbRocket",
  "TbBrain",
  "TbCode",
  "TbTerminal2",
  "BiCodeAlt",
  "BiChip",
  "BiData",
  "BiPlanet",
  "HiAcademicCap",
  "HiBriefcase",
  "HiRocketLaunch",
  "HiSparkles",
  "HiCommandLine",
  "HiCube",
  "HiGlobeAlt",
  "HiLockClosed",
  "HiKey",
  "FaReact",
  "FaNodeJs",
  "FaGithub",
  "FaLinkedin",
  "FaTwitter",
  "FaInstagram",
  "FaMedium",
  "FaDev",
] as const;

function packHas(name: string) {
  for (const len of [2, 3]) {
    const pack = PACKS[name.slice(0, len)];
    if (typeof pack?.[name] === "function") return true;
  }
  return false;
}

export const ICON_CATALOG = ICON_CATALOG_RAW.filter(packHas);

function looksLikeEmoji(value: string) {
  // Single grapheme / emoji-ish, not a react-icons PascalCase name
  return !/^[A-Z][A-Za-z0-9]+$/.test(value);
}

export function resolveIcon(name?: string | null): IconType | null {
  if (!name?.trim()) return null;
  const key = name.trim();
  if (looksLikeEmoji(key)) return null;

  for (const len of [2, 3]) {
    const prefix = key.slice(0, len);
    const pack = PACKS[prefix];
    const Icon = pack?.[key];
    if (typeof Icon === "function") return Icon;
  }
  return null;
}

export function isKnownIcon(name?: string | null) {
  return Boolean(resolveIcon(name));
}

type IconViewProps = {
  name?: string | null;
  className?: string;
  size?: number;
  title?: string;
};

/** Renders a react-icons name (e.g. FiGithub) or falls back to emoji/text. */
export function IconView({
  name,
  className,
  size = 18,
  title,
}: IconViewProps) {
  const Icon = resolveIcon(name);
  if (Icon) {
    return (
      <Icon
        className={className}
        size={size}
        title={title ?? name ?? undefined}
        aria-hidden={title ? undefined : true}
      />
    );
  }
  if (!name) return null;
  return (
    <span className={className} title={title} aria-hidden={title ? undefined : true}>
      {name}
    </span>
  );
}

export function searchIcons(query: string, limit = 48) {
  const q = query.trim().toLowerCase();
  if (!q) return ICON_CATALOG.slice(0, limit);
  return ICON_CATALOG.filter((name) => name.toLowerCase().includes(q)).slice(
    0,
    limit,
  );
}
