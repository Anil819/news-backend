// Populates the database with one user per role + sample news, events,
// gallery images, and a contact message — so the app is testable right
// after `npm install` without manually creating data first.
//
// Usage: npm run seed

import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import News from '../models/News.js'
import Event from '../models/Event.js'
import Gallery from '../models/Gallery.js'
import Message from '../models/Message.js'
import Notice from '../models/Notice.js'

dotenv.config()

const run = async () => {
  await connectDB()

  console.log('Clearing existing data...')
  await Promise.all([
    User.deleteMany(),
    News.deleteMany(),
    Event.deleteMany(),
    Gallery.deleteMany(),
    Message.deleteMany(),
    Notice.deleteMany()
  ])

  console.log('Creating users...')
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@college.edu.in',
    password: 'Admin@123',
    role: 'admin'
  })

  const teacher = await User.create({
    name: 'Dr. R. Sharma',
    email: 'teacher@college.edu.in',
    password: 'Teacher@123',
    role: 'teacher',
    employeeId: 'EMP-1024',
    department: 'Computer Science'
  })

  const student = await User.create({
    name: 'Aarav Patel',
    email: 'student@college.edu.in',
    password: 'Student@123',
    role: 'student',
    rollNumber: 'CS-2024-045',
    course: 'B.Tech CSE'
  })

  console.log('Creating news...')
  await News.create([
    {
      title: 'Annual Sports Meet 2024 Successfully Concluded',
      excerpt:
        'The Annual Sports Meet was a grand success with enthusiastic participation from students.',
      content:
        'The Annual Sports Meet 2024 concluded on a high note with record participation across track and field events. Students competed in over 20 categories, and the closing ceremony recognized outstanding athletes from each department.',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop',
      status: 'Published',
      author: admin._id
    },
    {
      title: 'Library New Digital Resources Added',
      excerpt: 'The library has added new digital resources for students and faculty members.',
      content:
        'The central library has expanded its digital catalogue with thousands of new e-books, journals, and research databases, accessible to all enrolled students and faculty through the library portal.',
      category: 'Academics',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop',
      status: 'Published',
      author: teacher._id
    },
    {
      title: 'Placement Drive By Tech Solutions',
      excerpt: 'Tech Solutions conducted a successful placement drive for final year students.',
      content:
        'Tech Solutions visited campus for its annual placement drive, interviewing over 150 final-year students across engineering branches. Offers will be rolled out over the next two weeks.',
      category: 'Placements',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
      status: 'Published',
      author: admin._id
    },
    {
      title: 'Workshop on Cyber Security',
      excerpt: 'A hands-on workshop on Cyber Security was organized for students.',
      content:
        'The Computer Science department organized a two-day hands-on workshop covering network security fundamentals, ethical hacking basics, and secure coding practices.',
      category: 'Academics',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
      status: 'Draft',
      author: teacher._id
    }
  ])

  console.log('Creating events...')
  await Event.create([
    {
      title: 'Guest Lecture on Web Development',
      description: 'An industry expert session covering modern web development practices.',
      date: new Date('2024-05-20'),
      time: '10:00 AM - 12:00 PM',
      location: 'Seminar Hall',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
      status: 'Upcoming',
      createdBy: teacher._id
    },
    {
      title: 'Annual Cultural Fest 2024',
      description: 'A full-day celebration of music, dance, drama, and art across departments.',
      date: new Date('2024-05-25'),
      time: '09:00 AM - 06:00 PM',
      location: 'College Campus',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
      status: 'Upcoming',
      createdBy: admin._id
    },
    {
      title: 'Workshop on AI & ML',
      description: 'Hands-on introduction to machine learning concepts and tools.',
      date: new Date('2024-05-30'),
      time: '11:00 AM - 01:00 PM',
      location: 'Computer Lab',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
      status: 'Upcoming',
      createdBy: teacher._id
    }
  ])

  console.log('Creating gallery images...')
  await Gallery.create([
    { category: 'Campus', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop', caption: 'Main building', uploadedBy: admin._id },
    { category: 'Sports', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', caption: 'Sports day', uploadedBy: admin._id },
    { category: 'Events', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=300&fit=crop', caption: 'Seminar', uploadedBy: teacher._id },
    { category: 'Cultural', image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=300&fit=crop', caption: 'Cultural fest', uploadedBy: admin._id },
    { category: 'Workshops', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop', caption: 'AI workshop', uploadedBy: teacher._id }
  ])

  console.log('Creating a sample contact message...')
  await Message.create({
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    subject: 'Question about admissions',
    message: 'Hi, could you tell me the deadline for the upcoming admission cycle?'
  })

  console.log('Creating notices...')
  await Notice.create([
    {
      title: 'Mid-Semester Exam Schedule Released',
      message:
        'The mid-semester examination timetable has been published on the student portal. Please check your respective department pages for exact dates and hall allocations.',
      image:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&h=400&fit=crop',
      audience: 'Student',
      priority: 'Important',
      postedBy: admin._id
    },
    {
      title: 'Faculty Meeting — Curriculum Review',
      message:
        'All department faculty are requested to attend the curriculum review meeting in the conference hall.',
      audience: 'Teacher',
      priority: 'Normal',
      postedBy: admin._id
    },
    {
      title: 'Campus Closed for Maintenance',
      message:
        'The campus will remain closed this Saturday for scheduled electrical maintenance work.',
      audience: 'All',
      priority: 'Urgent',
      postedBy: admin._id
    }
  ])

  console.log('\nSeed complete. Login with:')
  console.log('  Admin   -> admin@college.edu.in   / Admin@123')
  console.log('  Teacher -> teacher@college.edu.in / Teacher@123')
  console.log('  Student -> student@college.edu.in / Student@123')

  process.exit(0)
}

run().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
