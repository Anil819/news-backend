import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    excerpt: {
      type: String,
      required: [true, 'A short excerpt is required'],
      trim: true,
      maxlength: 300
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    category: {
      type: String,
      enum: ['Academics', 'Events', 'Placements', 'Campus', 'Announcements', 'Sports'],
      default: 'Campus'
    },
    image: {
      type: String,
      default: ''
    },
      imagePublicId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ['Published', 'Draft'],
      default: 'Published'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

newsSchema.index({ title: 'text', excerpt: 'text' })

const News = mongoose.model('News', newsSchema)

export default News
