import multer from "multer";

const storage = multer.memoryStorage();

const uploadMemory = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadMemory;