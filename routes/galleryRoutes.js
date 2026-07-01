import express from 'express'
import {
  getGalleryImages,
  getGalleryImageById,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} from '../controllers/galleryController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getGalleryImages)
router.get('/:id', getGalleryImageById)

router.post('/', protect, restrictTo('admin', 'teacher'), addGalleryImage)
router.put('/:id', protect, restrictTo('admin', 'teacher'), updateGalleryImage)
router.delete('/:id', protect, restrictTo('admin'), deleteGalleryImage)

export default router
