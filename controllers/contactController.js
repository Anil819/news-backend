import asyncHandler from 'express-async-handler'
import Message from '../models/Message.js'

// @desc    Submit the public contact form
// @route   POST /api/contact
// @access  Public
export const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    res.status(400)
    throw new Error('Name, email, subject, and message are all required.')
  }

  const saved = await Message.create({ name, email, subject, message })
  res.status(201).json({
    success: true,
    message: "Your message has been sent. We'll get back to you soon.",
    data: saved
  })
})

// @desc    Get all contact messages
// @route   GET /api/contact?status=Unread
// @access  Private/Admin
export const getMessages = asyncHandler(async (req, res) => {
  const { status } = req.query
  const filter = {}
  if (status) filter.status = status

  const messages = await Message.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, count: messages.length, messages })
})

// @desc    Mark a message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
export const markMessageRead = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndUpdate(
    req.params.id,
    { status: 'Read' },
    { new: true }
  )
  if (!msg) {
    res.status(404)
    throw new Error('Message not found.')
  }
  res.json({ success: true, message: msg })
})

// @desc    Delete a message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id)
  if (!msg) {
    res.status(404)
    throw new Error('Message not found.')
  }
  res.json({ success: true, message: 'Message deleted successfully.' })
})
