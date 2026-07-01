import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

// Verifies the JWT (from httpOnly cookie, or Authorization header as a
// fallback for API clients like Postman) and attaches req.user.
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized. Please log in.')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      res.status(401)
      throw new Error('User belonging to this token no longer exists.')
    }

    if (!user.isActive) {
      res.status(403)
      throw new Error('This account has been deactivated. Contact an administrator.')
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized. Invalid or expired session.')
  }
})

// Usage: restrictTo('admin') or restrictTo('admin', 'teacher')
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403)
      throw new Error(`Role "${req.user.role}" is not permitted to perform this action.`)
    }
    next()
  }
}

// For public routes that change behaviour slightly when a user happens
// to be logged in (e.g. showing drafts to staff). Never blocks the request.
export const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (user && user.isActive) req.user = user
  } catch {
    // Invalid/expired token on a public route — just proceed as a guest.
  }

  next()
})
