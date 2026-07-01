import express from 'express'
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent
} from '../controllers/eventController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getEvents)
router.get('/:id', getEventById)

router.post('/', protect, restrictTo('admin', 'teacher'), createEvent)
router.put('/:id', protect, restrictTo('admin', 'teacher'), updateEvent)
router.delete('/:id', protect, restrictTo('admin'), deleteEvent)

router.post('/:id/register', protect, registerForEvent)
router.delete('/:id/register', protect, unregisterFromEvent)

export default router
