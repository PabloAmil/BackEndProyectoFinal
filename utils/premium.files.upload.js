import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = path.resolve(__dirname, '..'); 
const publicDir = path.join(rootDir, 'public');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'general';
    if (file.fieldname === 'profile') {
      folder = 'profile';
    } else if (file.fieldname === 'product') {
      folder = 'products';
    } else if (file.fieldname === 'document') {
      folder = 'documents';
    }

    const uploadPath = path.join(publicDir, folder);
    
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

export default upload;
