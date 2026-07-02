// import asyncHandler from "express-async-handler";

// export const uploadImage = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     res.status(400);
//     throw new Error("No file uploaded.");
//   }

//   res.status(201).json({
//     success: true,
//     url: req.file.path,       // Cloudinary image URL
//     public_id: req.file.filename,
//   });
// });

import asyncHandler from "express-async-handler";

export const uploadImage = asyncHandler(async (req, res) => {
  console.log("====== UPLOAD ======");
  console.log("req.file =", req.file);

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  res.status(201).json({
    success: true,
    url: req.file.path,
    public_id: req.file.filename,
  });
});