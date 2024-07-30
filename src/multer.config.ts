
import { memoryStorage } from 'multer';



export const multerConfig = {
  storage: memoryStorage(),

  fileFilter: (_req: any, file: { mimetype: string; }, callback: (arg0: Error, arg1: boolean) => void) => {
   
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type'), false);
    }
  },
};
