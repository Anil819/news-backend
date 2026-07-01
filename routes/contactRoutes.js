import express from 'express'
import {
  sendMessage,
  getMessages,
  markMessageRead,
  deleteMessage
} from '../controllers/contactController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = express.Router()

router.post('/', sendMessage)

router.get('/', protect, restrictTo('admin'), getMessages)
router.put('/:id/read', protect, restrictTo('admin'), markMessageRead)
router.delete('/:id', protect, restrictTo('admin'), deleteMessage)

export default router
