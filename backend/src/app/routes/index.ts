import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { ProjectRoutes } from '../modules/project/project.module';
import { OpenSourceRoutes } from '../modules/openSource/openSource.module';
import { SkillRoutes } from '../modules/skill/skill.module';
import { ExperienceRoutes } from '../modules/experience/experience.module';
import { EducationRoutes } from '../modules/education/education.module';
import { SocialLinkRoutes } from '../modules/socialLink/socialLink.module';
import { PersonRoutes } from '../modules/person/person.module';
import { FileItemRoutes } from '../modules/fileItem/fileItem.module';
import { ProfileRoutes } from '../modules/profile/profile.module';
import { AboutRoutes } from '../modules/about/about.module';
import { SiteSettingsRoutes } from '../modules/siteSettings/siteSettings.module';
import { ResumeRoutes } from '../modules/resume/resume.module';
import { SeedRoutes } from '../modules/seed/seed.route';
import { PortfolioRoutes } from '../modules/portfolio/portfolio.module';
import { AnalyticsRoutes } from '../modules/analytics/analytics.module';
import { UploadRoutes } from '../modules/upload/upload.module';

const router = Router();

const moduleRoutes: { path: string; route: Router }[] = [
  { path: '/users', route: UserRoutes },
  { path: '/portfolio', route: PortfolioRoutes },
  { path: '/analytics', route: AnalyticsRoutes },
  { path: '/profile', route: ProfileRoutes },
  { path: '/about', route: AboutRoutes },
  { path: '/resume', route: ResumeRoutes },
  { path: '/site-settings', route: SiteSettingsRoutes },
  { path: '/skills', route: SkillRoutes },
  { path: '/experiences', route: ExperienceRoutes },
  { path: '/education', route: EducationRoutes },
  { path: '/projects', route: ProjectRoutes },
  { path: '/open-source', route: OpenSourceRoutes },
  { path: '/social-links', route: SocialLinkRoutes },
  { path: '/people', route: PersonRoutes },
  { path: '/files', route: FileItemRoutes },
  { path: '/seed', route: SeedRoutes },
  { path: '/upload', route: UploadRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

