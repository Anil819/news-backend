import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      enum: ['Events', 'Campus', 'Sports', 'Cultural', 'Workshops'],
      required: [true, 'Category is required']
    },
    image: {
      type: String,
      required: [true, 'Image URL is required']
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const Gallery = mongoose.model('Gallery', gallerySchema)

export default Gallery
