import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { uploadToCloudinary, UploadFolder } from '../services/cloudinaryService';
import { Request, Response, NextFunction } from 'express';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, WebP images and PDF files are allowed'));
        }
    },
});

const router = Router();

router.use(authenticate);

// POST /api/v1/upload — upload a single file to Cloudinary
router.post(
    '/',
    upload.single('file'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: { code: 'MISSING_FILE', message: 'No file provided' } });
            }

            const folder = (req.body.folder || 'products') as UploadFolder;
            const result = await uploadToCloudinary(req.file.buffer, folder);

            res.status(201).json({
                url: result.url,
                publicId: result.publicId,
            });
        } catch (err) {
            next(err);
        }
    }
);

// POST /api/v1/upload/multiple — upload multiple files
router.post(
    '/multiple',
    upload.array('files', 10),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.files as Express.Multer.File[];
            if (!files?.length) {
                return res.status(400).json({ error: { code: 'MISSING_FILES', message: 'No files provided' } });
            }

            const folder = (req.body.folder || 'products') as UploadFolder;
            const results = await Promise.all(
                files.map((file) => uploadToCloudinary(file.buffer, folder))
            );

            res.status(201).json({ uploads: results });
        } catch (err) {
            next(err);
        }
    }
);

export default router;
