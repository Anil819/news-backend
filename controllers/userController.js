import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

// @desc    Get all users (with optional role filter + search + pagination)
// @route   GET /api/users?role=student&search=aarav&page=1&limit=20
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query

  const filter = {}
  if (role) filter.role = role
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }

  const skip = (Number(page) - 1) * Number(limit)

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter)
  ])

  res.json({
    success: true,
    count: users.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    users
  })
})

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found.')
  }
  res.json({ success: true, user })
})

// @desc    Admin creates a user directly (any role)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, rollNumber, course, employeeId, department } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email, and password are required.')
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    res.status(400)
    throw new Error('A user with this email already exists.')
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    rollNumber,
    course,
    employeeId,
    department
  })

  res.status(201).json({ success: true, user })
})

// @desc    Admin updates any user's profile, role, or active status
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const fields = [
    'name',
    'email',
    'role',
    'rollNumber',
    'course',
    'employeeId',
    'department',
    'isActive'
  ]
  const updates = {}
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  })

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  })

  if (!user) {
    res.status(404)
    throw new Error('User not found.')
  }

  res.json({ success: true, user })
})

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    res.status(400)
    throw new Error('You cannot delete your own account while logged in.')
  }

  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found.')
  }

  res.json({ success: true, message: 'User deleted successfully.' })
})
