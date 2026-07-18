import { Request, Response, Router } from 'express';
import { About } from '../about/about.module';
import { Education } from '../education/education.module';
import { Experience } from '../experience/experience.module';
import { FileItem } from '../fileItem/fileItem.module';
import { OpenSource } from '../openSource/openSource.module';
import { Person } from '../person/person.module';
import { Profile } from '../profile/profile.module';
import { Project, toPublicProject } from '../project/project.module';
import { Resume } from '../resume/resume.module';
import { SiteSettings } from '../siteSettings/siteSettings.module';
import { Skill } from '../skill/skill.module';
import { SocialLink } from '../socialLink/socialLink.module';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const router = Router();

router.get(
  '/',
  catchAsync(async (_req: Request, res: Response) => {
    const [
      profile,
      about,
      resume,
      siteSettings,
      skills,
      experiences,
      education,
      projects,
      openSource,
      socialLinks,
      people,
      files,
    ] = await Promise.all([
      Profile.findOne(),
      About.findOne(),
      Resume.findOne(),
      SiteSettings.findOne(),
      Skill.find({ isDeleted: { $ne: true }, published: { $ne: false } }).sort({
        sortOrder: 1,
      }),
      Experience.find({
        isDeleted: { $ne: true },
        published: { $ne: false },
      }).sort({ sortOrder: 1 }),
      Education.find({
        isDeleted: { $ne: true },
        published: { $ne: false },
      }).sort({ sortOrder: 1 }),
      Project.find({ isDeleted: { $ne: true }, published: { $ne: false } }).sort(
        { sortOrder: 1 },
      ),
      OpenSource.find({
        isDeleted: { $ne: true },
        published: { $ne: false },
      }).sort({ sortOrder: 1 }),
      SocialLink.find({
        isDeleted: { $ne: true },
        published: { $ne: false },
      }).sort({ sortOrder: 1 }),
      Person.find({ isDeleted: { $ne: true }, published: { $ne: false } }).sort({
        sortOrder: 1,
      }),
      FileItem.find({
        isDeleted: { $ne: true },
        published: { $ne: false },
      }).sort({ sortOrder: 1 }),
    ]);

    const publicSettings = siteSettings
      ? (() => {
          const obj = siteSettings.toObject();
          delete (obj as { repoUnlockPassword?: string }).repoUnlockPassword;
          delete (obj as { vaultMasterPasscode?: string }).vaultMasterPasscode;
          return obj;
        })()
      : null;

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Portfolio bundle retrieved successfully',
      data: {
        profile,
        about,
        resume,
        siteSettings: publicSettings,
        skills,
        experiences,
        education,
        projects: projects.map((p) => toPublicProject(p)),
        openSource,
        socialLinks,
        people,
        files,
      },
    });
  }),
);

export const PortfolioRoutes = router;
