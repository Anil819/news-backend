import express from 'express'
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} from '../controllers/noticeController.js'
import { protect, restrictTo, attachUserIfPresent } from '../middleware/auth.js'

const router = express.Router()

router.get('/', attachUserIfPresent, getNotices)
router.get('/:id', getNoticeById)

router.post('/', protect, restrictTo('admin'), createNotice)
router.put('/:id', protect, restrictTo('admin'), updateNotice)
router.delete('/:id', protect, restrictTo('admin'), deleteNotice)

export default router
