import express from 'express'
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js'
import { protect, restrictTo, attachUserIfPresent } from '../middleware/auth.js'

const router = express.Router()

router.get('/', attachUserIfPresent, getNews)
router.get('/:id', getNewsById)

router.post('/', protect, restrictTo('admin', 'teacher'), createNews)
router.put('/:id', protect, restrictTo('admin', 'teacher'), updateNews)
router.delete('/:id', protect, restrictTo('admin'), deleteNews)

export default router
