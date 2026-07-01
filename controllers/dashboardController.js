import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import News from '../models/News.js'
import Event from '../models/Event.js'
import Message from '../models/Message.js'
import Notice from '../models/Notice.js'

// @desc    Get site-wide stats + recent news for the admin dashboard
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [totalNews, totalEvents, totalUsers, totalMessages, totalNotices, recentNews] =
    await Promise.all([
      News.countDocuments(),
      Event.countDocuments(),
      User.countDocuments(),
      Message.countDocuments({ status: 'Unread' }),
      Notice.countDocuments(),
      News.find().populate('author', 'name').sort({ createdAt: -1 }).limit(5)
    ])

  res.json({
    success: true,
    stats: {
      totalNews,
      totalEvents,
      totalUsers,
      totalMessages,
      totalNotices
    },
    recentNews
  })
})

// @desc    Get the logged-in teacher's dashboard summary
// @route   GET /api/dashboard/teacher
// @access  Private/Teacher
export const getTeacherDashboard = asyncHandler(async (req, res) => {
  const [myNews, myEvents] = await Promise.all([
    News.find({ author: req.user._id }).sort({ createdAt: -1 }).limit(5),
    Event.find({ createdBy: req.user._id }).sort({ date: 1 })
  ])

  const totalRegistrations = myEvents.reduce((sum, e) => sum + e.registrations.length, 0)

  res.json({
    success: true,
    stats: {
      myClasses: myEvents.length,
      totalRegistrations,
      myNewsPosts: myNews.length
    },
    myNews,
    myEvents
  })
})

// @desc    Get the logged-in student's dashboard summary
// @route   GET /api/dashboard/student
// @access  Private/Student
export const getStudentDashboard = asyncHandler(async (req, res) => {
  const [upcomingEvents, registeredEvents, latestNews] = await Promise.all([
    Event.find({ status: 'Upcoming' }).sort({ date: 1 }).limit(5),
    Event.find({ registrations: req.user._id }).sort({ date: 1 }),
    News.find({ status: 'Published' }).sort({ createdAt: -1 }).limit(5)
  ])

  res.json({
    success: true,
    stats: {
      upcomingEventsCount: upcomingEvents.length,
      registeredEventsCount: registeredEvents.length
    },
    upcomingEvents,
    registeredEvents,
    latestNews
  })
})
