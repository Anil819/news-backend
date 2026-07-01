import jwt from 'jsonwebtoken'

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// Attaches the JWT as an httpOnly cookie so the frontend never has to
// handle the raw token, and clearing it on logout is a single call.
export const sendTokenCookie = (res, token) => {
  const days = Number(process.env.COOKIE_EXPIRES_DAYS) || 7

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  })
}

export default generateToken
