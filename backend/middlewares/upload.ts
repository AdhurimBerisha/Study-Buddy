import multer from "multer";
import { cloudinaryStorage } from "../config/cloudinary";

export const upload = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export const uploadAvatar = upload.single("avatar");

export const debugUpload = (req: any, res: any, next: any) => {
  console.log("Upload middleware - req.file:", req.file);
  console.log("Upload middleware - req.body:", req.body);
  console.log("Upload middleware - req.headers:", req.headers);
  next();
};

export const handleUploadError = (
  error: any,
  req: any,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "File upload error",
    });
  }
  next();
};
