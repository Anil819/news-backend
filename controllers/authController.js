import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken, { sendTokenCookie } from '../utils/generateToken.js'

// @desc    Register a new user (student, teacher, or admin)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    rollNumber,
    course,
    employeeId,
    department,
    adminCode
  } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email, and password are required.')
  }

  const normalizedRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student'

  // Admin signups must supply the correct invite code — without this,
  // anyone could register themselves as an administrator.
  if (normalizedRole === 'admin') {
    if (!adminCode || adminCode !== process.env.ADMIN_INVITE_CODE) {
      res.status(403)
      throw new Error('Invalid admin invite code.')
    }
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    res.status(400)
    throw new Error('An account with this email already exists.')
  }

  const user = await User.create({
    name,
    email,
    password,
    role: normalizedRole,
    rollNumber: normalizedRole === 'student' ? rollNumber : undefined,
    course: normalizedRole === 'student' ? course : undefined,
    employeeId: normalizedRole === 'teacher' ? employeeId : undefined,
    department: normalizedRole === 'teacher' ? department : undefined
  })

  const token = generateToken(user._id, user.role)
  sendTokenCookie(res, token)

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    user,
    token
  })
})

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required.')
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password.')
  }

  if (!user.isActive) {
    res.status(403)
    throw new Error('This account has been deactivated. Contact an administrator.')
  }

  // If the frontend's role tab doesn't match the account's actual role,
  // reject — this stops a student from logging in through the admin tab.
  if (role && role !== user.role) {
    res.status(403)
    throw new Error(`This account is registered as "${user.role}", not "${role}".`)
  }

  const token = generateToken(user._id, user.role)
  sendTokenCookie(res, token)

  res.json({
    success: true,
    message: 'Login successful.',
    user,
    token
  })
})

// @desc    Logout the current user (clears the auth cookie)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.json({ success: true, message: 'Logged out successfully.' })
})

// @desc    Get the currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user })
})

// @desc    Update the currently logged-in user's own profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const fields = ['name', 'rollNumber', 'course', 'employeeId', 'department', 'avatar']
  const updates = {}
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  })

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  })

  res.json({ success: true, user })
})

// @desc    Change the currently logged-in user's password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    res.status(400)
    throw new Error('Current and new password are required.')
  }

  const user = await User.findById(req.user._id).select('+password')

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401)
    throw new Error('Current password is incorrect.')
  }

  user.password = newPassword
  await user.save()

  res.json({ success: true, message: 'Password updated successfully.' })
})

