import mongoose from 'mongoose'

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required']
    },
    image: {
      type: String,
      default: ''
    },
    // Who should see this notice. 'All' shows to every visitor, including guests.
    audience: {
      type: String,
      enum: ['All', 'Student', 'Teacher'],
      default: 'All'
    },
    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Optional — notices past this date are hidden from public listings.
    expiresAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

const Notice = mongoose.model('Notice', noticeSchema)

export default Notice
