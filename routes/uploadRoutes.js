import express from 'express'
import { uploadImage } from '../controllers/uploadController.js'
import { protect, restrictTo } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/', protect, restrictTo('admin', 'teacher'), upload.single('image'), uploadImage)

export default router

