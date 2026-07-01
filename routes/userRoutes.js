import express from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js'
import { protect, restrictTo } from '../middleware/auth.js'

const router = express.Router()

router.use(protect, restrictTo('admin'))

router.route('/').get(getUsers).post(createUser)
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser)

export default router
