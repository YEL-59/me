import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import dashboardAuth from '../../middlewares/dashboardAuth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { About } from '../about/about.module';
import { Education } from '../education/education.module';
import { Experience } from '../experience/experience.module';
import { FileItem } from '../fileItem/fileItem.module';
import { OpenSource } from '../openSource/openSource.module';
import { Person } from '../person/person.module';
import { Profile } from '../profile/profile.module';
import { Project } from '../project/project.module';
import { Resume } from '../resume/resume.module';
import { SiteSettings } from '../siteSettings/siteSettings.module';
import { Skill } from '../skill/skill.module';
import { SocialLink } from '../socialLink/socialLink.module';
import { seedPayload } from './seed.data';

const router = Router();

router.post(
  '/',
  dashboardAuth,
  catchAsync(async (_req: Request, res: Response) => {
    const collections = [
      Profile,
      About,
      Resume,
      SiteSettings,
      Skill,
      Experience,
      Education,
      Project,
      OpenSource,
      SocialLink,
      Person,
      FileItem,
    ];

    for (const Model of collections) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (Model as any).deleteMany({});
    }

    await Profile.create(seedPayload.profile);
    await About.create(seedPayload.about);
    await Resume.create(seedPayload.resume);
    await SiteSettings.create(seedPayload.siteSettings);
    await Skill.insertMany(seedPayload.skills);
    await Experience.insertMany(seedPayload.experiences);
    await Education.insertMany(seedPayload.education);
    await Project.insertMany(seedPayload.projects);
    await OpenSource.insertMany(seedPayload.openSource);
    await SocialLink.insertMany(seedPayload.socialLinks);
    await Person.insertMany(seedPayload.people);
    await FileItem.insertMany(seedPayload.files);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Portfolio seeded successfully',
      data: {
        db: mongoose.connection.name,
        counts: {
          skills: seedPayload.skills.length,
          experiences: seedPayload.experiences.length,
          education: seedPayload.education.length,
          projects: seedPayload.projects.length,
          openSource: seedPayload.openSource.length,
          socialLinks: seedPayload.socialLinks.length,
          people: seedPayload.people.length,
          files: seedPayload.files.length,
        },
      },
    });
  }),
);

export const SeedRoutes = router;
