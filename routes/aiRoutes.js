import express from "express";
import upload from "../middleware/upload.js";
import { generateDescription } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-description", (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("Multer Error:", err);

      return res.status(500).json({
        success: false,
        message: err.message,
        error: err,
      });
    }

    // console.log("File:", req.file);

    generateDescription(req, res);
  });
});

export default router;