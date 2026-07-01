import asyncHandler from 'express-async-handler'

// @desc    Upload a single image (used for news/event/gallery image fields)
// @route   POST /api/upload
// @access  Private/Admin,Teacher
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('No file uploaded.')
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.status(201).json({ success: true, url })
})
