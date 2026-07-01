import asyncHandler from 'express-async-handler'
import Gallery from '../models/Gallery.js'

// @desc    Get all gallery images (optional category filter)
// @route   GET /api/gallery?category=Sports
// @access  Public
export const getGalleryImages = asyncHandler(async (req, res) => {
  const { category } = req.query
  const filter = {}
  if (category && category !== 'All') filter.category = category

  const images = await Gallery.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, count: images.length, images })
})

// @desc    Get a single gallery image
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryImageById = asyncHandler(async (req, res) => {
  const image = await Gallery.findById(req.params.id)
  if (!image) {
    res.status(404)
    throw new Error('Image not found.')
  }
  res.json({ success: true, image })
})

// @desc    Add a gallery image
// @route   POST /api/gallery
// @access  Private/Admin,Teacher
export const addGalleryImage = asyncHandler(async (req, res) => {
  const { category, image, caption } = req.body

  if (!category || !image) {
    res.status(400)
    throw new Error('Category and image are required.')
  }

  const item = await Gallery.create({
    category,
    image,
    caption,
    uploadedBy: req.user._id
  })

  res.status(201).json({ success: true, image: item })
})

// @desc    Update a gallery image's caption/category
// @route   PUT /api/gallery/:id
// @access  Private/Admin,Teacher
export const updateGalleryImage = asyncHandler(async (req, res) => {
  const fields = ['category', 'image', 'caption']
  const updates = {}
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  })

  const item = await Gallery.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  })

  if (!item) {
    res.status(404)
    throw new Error('Image not found.')
  }

  res.json({ success: true, image: item })
})

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id)
  if (!item) {
    res.status(404)
    throw new Error('Image not found.')
  }
  res.json({ success: true, message: 'Image deleted successfully.' })
})
