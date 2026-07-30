import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary if env vars exist
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_URL || 
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

if (isCloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL
    });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
}

// Configure Vercel API body size limit for video uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    let fileUrl = '';
    let provider = 'local';

    if (body.base64 && body.name) {
      // 1. Try Cloudinary if configured
      if (isCloudinaryConfigured) {
        try {
          const uploadRes = await cloudinary.uploader.upload(body.base64, {
            folder: 'dhara_gallery',
            resource_type: 'auto'
          });
          fileUrl = uploadRes.secure_url;
          provider = 'cloudinary';
        } catch (cloudinaryErr: any) {
          console.error('Cloudinary upload error, falling back to local storage:', cloudinaryErr.message || cloudinaryErr);
        }
      }

      // 2. Fallback to local storage if Cloudinary wasn't used or failed
      if (!fileUrl) {
        const base64Data = body.base64.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${Date.now()}_${body.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
        try {
          await fs.mkdir(uploadDir, { recursive: true });
          const filePath = path.join(uploadDir, filename);
          await fs.writeFile(filePath, buffer);
          fileUrl = `/uploads/${filename}`;
          provider = 'local';
        } catch (fsError: any) {
          console.warn('Writing to local disk failed (read-only filesystem), returning base64 string:', fsError.message);
          fileUrl = body.base64;
          provider = 'base64';
        }
      }
    } else {
      return res.status(400).json({ error: 'Invalid payload. Expecting base64 image or video data.' });
    }

    return res.status(200).json({ success: true, url: fileUrl, provider });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
}

