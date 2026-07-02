import asyncHandler from 'express-async-handler'
import Notice from '../models/Notice.js'

export const getNotices = asyncHandler(async (req, res) => {
  const now = new Date()
  const filter = {
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }]
  }

  if (req.user?.role === 'admin') {
    if (req.query.audience) filter.audience = req.query.audience
  } else if (req.user?.role === 'teacher') {
    filter.audience = { $in: ['All', 'Teacher'] }
  } else if (req.user?.role === 'student') {
    filter.audience = { $in: ['All', 'Student'] }
  } else {
    filter.audience = 'All'
  }

  const notices = await Notice.find(filter)
    .populate('postedBy', 'name role')
    .sort({ createdAt: -1 })

  res.json({ success: true, count: notices.length, notices })
})

// @desc    Get a single notice
// @route   GET /api/notices/:id
// @access  Public
export const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate('postedBy', 'name role')
  if (!notice) {
    res.status(404)
    throw new Error('Notice not found.')
  }
  res.json({ success: true, notice })
})

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Admin
export const createNotice = asyncHandler(async (req, res) => {
  const { title, message, audience, priority, expiresAt, image } = req.body

  if (!title || !message) {
    res.status(400)
    throw new Error('Title and message are required.')
  }

  const notice = await Notice.create({
    title,
    message,
    image: image || '',
    audience,
    priority,
    expiresAt: expiresAt || null,
    postedBy: req.user._id
  })

  res.status(201).json({ success: true, notice })
})

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
export const updateNotice = asyncHandler(async (req, res) => {
  const fields = ['title', 'message', 'image', 'audience', 'priority', 'expiresAt']
  const updates = {}
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  })

  const notice = await Notice.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  })

  if (!notice) {
    res.status(404)
    throw new Error('Notice not found.')
  }

  res.json({ success: true, notice })
})

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id)
  if (!notice) {
    res.status(404)
    throw new Error('Notice not found.')
  }
  res.json({ success: true, message: 'Notice deleted successfully.' })
})
