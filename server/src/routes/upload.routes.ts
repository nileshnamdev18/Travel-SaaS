import { Router, Response } from 'express';
import multer from 'multer';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are supported'));
  }
});

// POST /api/packages/upload-image  (admin) -> returns data URL
router.post('/upload-image', authenticate, requireAdmin, upload.single('file'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).json({ success: false, message: 'No image file provided' });
      return;
    }
    const mime = req.file.mimetype;
    const b64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${mime};base64,${b64}`;
    res.json({ success: true, data: { url: dataUrl } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Upload failed' });
  }
});

export default router;
