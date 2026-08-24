import fs from 'node:fs';
import path from 'node:path';
import { Request, Response, Router } from 'express';
import multer from 'multer';
import AppError from '../../errors/AppError';
import dashboardAuth from '../../middlewares/dashboardAuth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBaseName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedExts = [
    '.pdf',
    '.tex',
    '.doc',
    '.docx',
    '.txt',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.svg',
    '.gif',
    '.json',
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        400,
        `File type ${ext} is not allowed. Supported: ${allowedExts.join(', ')}`,
      ),
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

const router = Router();

router.post(
  '/',
  dashboardAuth,
  upload.single('file'),
  catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(400, 'Please select a file to upload');
    }

    const host = req.get('host') || 'localhost:5001';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  }),
);

export const UploadRoutes = router;
