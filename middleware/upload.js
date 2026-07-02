import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "college-news-portal",

    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],

    transformation: [
      {
        width: 1200,
        crop: "limit",
        quality: "auto",
      },
    ],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;