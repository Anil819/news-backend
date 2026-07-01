import asyncHandler from 'express-async-handler'
import Event from '../models/Event.js'

// @desc    Get all events
// @route   GET /api/events?status=Upcoming
// @access  Public
export const getEvents = asyncHandler(async (req, res) => {
  const { status } = req.query
  const filter = {}
  if (status) filter.status = status

  const events = await Event.find(filter).sort({ date: 1 })
  res.json({ success: true, count: events.length, events })
})

// @desc    Get a single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) {
    res.status(404)
    throw new Error('Event not found.')
  }
  res.json({ success: true, event })
})

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin,Teacher
export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, time, location, image, status } = req.body

  if (!title || !date || !time || !location) {
    res.status(400)
    throw new Error('Title, date, time, and location are required.')
  }

  const event = await Event.create({
    title,
    description,
    date,
    time,
    location,
    image,
    status,
    createdBy: req.user._id
  })

  res.status(201).json({ success: true, event })
})

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin,Teacher
export const updateEvent = asyncHandler(async (req, res) => {
  const fields = ['title', 'description', 'date', 'time', 'location', 'image', 'status']
  const updates = {}
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  })

  const event = await Event.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  })

  if (!event) {
    res.status(404)
    throw new Error('Event not found.')
  }

  res.json({ success: true, event })
})

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id)
  if (!event) {
    res.status(404)
    throw new Error('Event not found.')
  }
  res.json({ success: true, message: 'Event deleted successfully.' })
})

// @desc    Register the logged-in user for an event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) {
    res.status(404)
    throw new Error('Event not found.')
  }

  if (event.registrations.some((id) => id.equals(req.user._id))) {
    res.status(400)
    throw new Error('You are already registered for this event.')
  }

  event.registrations.push(req.user._id)
  await event.save()

  res.json({ success: true, message: 'Registered for event successfully.' })
})

// @desc    Unregister the logged-in user from an event
// @route   DELETE /api/events/:id/register
// @access  Private
export const unregisterFromEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
  if (!event) {
    res.status(404)
    throw new Error('Event not found.')
  }

  event.registrations = event.registrations.filter((id) => !id.equals(req.user._id))
  await event.save()

  res.json({ success: true, message: 'Registration cancelled.' })
})
