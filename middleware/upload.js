import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase()
    cb(null, `${base}-${Date.now()}${ext}`)
  }
})

const allowedTypes = /jpeg|jpg|png|webp|gif/

const fileFilter = (req, file, cb) => {
  const isAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  if (isAllowed) return cb(null, true)
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed.'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

export default upload
