import asyncHandler from 'express-async-handler'
import News from '../models/News.js'

// @desc    Get all published news (with category filter + pagination)
// @route   GET /api/news?category=Academics&page=1&limit=6
// @access  Public
export const getNews = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 6, includeUnpublished } = req.query

  const filter = {}
  if (category && category !== 'All News') filter.category = category

  // Public visitors only ever see Published news. Logged-in admins/teachers
  // viewing their own management screen can ask to include drafts.
  if (!(includeUnpublished === 'true' && req.user && req.user.role !== 'student')) {
    filter.status = 'Published'
  }

  const skip = (Number(page) - 1) * Number(limit)

  const [news, total] = await Promise.all([
    News.find(filter)
      .populate('author', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    News.countDocuments(filter)
  ])

  res.json({
    success: true,
    count: news.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    news
  })
})

// @desc    Get a single news article
// @route   GET /api/news/:id
// @access  Public
export const getNewsById = asyncHandler(async (req, res) => {
  const article = await News.findById(req.params.id).populate('author', 'name role')
  if (!article) {
    res.status(404)
    throw new Error('News article not found.')
  }
  res.json({ success: true, news: article })
})

// @desc    Create a news article
// @route   POST /api/news
// @access  Private/Admin,Teacher
export const createNews = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category, image, status } = req.body

  if (!title || !excerpt || !content) {
    res.status(400)
    throw new Error('Title, excerpt, and content are required.')
  }

  const article = await News.create({
    title,
    excerpt,
    content,
    category,
    image,
    status,
    author: req.user._id
  })

  res.status(201).json({ success: true, news: article })
})

// @desc    Update a news article
// @route   PUT /api/news/:id
// @access  Private/Admin,Teacher
export const updateNews = asyncHandler(async (req, res) => {
  const fields = ['title', 'excerpt', 'content', 'category', 'image', 'status']
  const updates = {}
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  })

  const article = await News.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  })

  if (!article) {
    res.status(404)
    throw new Error('News article not found.')
  }

  res.json({ success: true, news: article })
})

// @desc    Delete a news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
export const deleteNews = asyncHandler(async (req, res) => {
  const article = await News.findByIdAndDelete(req.params.id)
  if (!article) {
    res.status(404)
    throw new Error('News article not found.')
  }
  res.json({ success: true, message: 'News article deleted successfully.' })
})
