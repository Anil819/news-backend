# College News Portal — Backend

Node.js + Express + MongoDB API powering the College News Portal frontend.
Handles registration, login/logout, and role-based access for **students**,
**teachers**, and **admins** — plus full CRUD for news, events, gallery
images, and contact messages.

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth stored in an **httpOnly cookie** (so logout is a real, working
  server action — not just "delete the token in localStorage")
- bcryptjs for password hashing
- multer for image uploads

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — point this at your local MongoDB or a MongoDB Atlas cluster.
- `JWT_SECRET` — set this to a long random string.
- `ADMIN_INVITE_CODE` — the code anyone must enter to register as an admin.
- `CLIENT_URL` — your frontend's URL (default assumes Vite on `5173`).

Start MongoDB locally (if not using Atlas), then:

```bash
npm run dev      # starts with nodemon, auto-restarts on changes
# or
npm start        # plain node
```

Server runs on `http://localhost:5000` by default.

### Seed sample data (recommended for first run)

```bash
npm run seed
```

This wipes the database and creates one user per role, plus sample news,
events, gallery images, and a contact message:

| Role    | Email                    | Password      |
|---------|---------------------------|---------------|
| Admin   | admin@college.edu.in      | Admin@123     |
| Teacher | teacher@college.edu.in    | Teacher@123   |
| Student | student@college.edu.in    | Student@123   |

## Project structure

```
config/
  db.js                  MongoDB connection
controllers/
  authController.js      register, login, logout, getMe, updateMe, changePassword
  userController.js      Admin: list/create/update/delete any user
  newsController.js      News CRUD (public read, admin/teacher write)
  eventController.js     Event CRUD + register/unregister
  galleryController.js   Gallery image CRUD
  contactController.js   Contact form submit + admin inbox management
  dashboardController.js Stats for admin/teacher/student dashboards
  uploadController.js    Image upload handler
middleware/
  auth.js                protect, restrictTo(roles), attachUserIfPresent
  upload.js              multer disk storage config
  errorHandler.js         notFound + centralized error formatting
models/
  User.js, News.js, Event.js, Gallery.js, Message.js
routes/
  authRoutes.js, userRoutes.js, newsRoutes.js, eventRoutes.js,
  galleryRoutes.js, contactRoutes.js, dashboardRoutes.js, uploadRoutes.js
utils/
  generateToken.js       JWT creation + cookie helper
  seed.js                Sample data seeder
uploads/                 Uploaded images are saved here, served at /uploads
server.js                App entry point
```

## API reference

All responses are JSON: `{ success, ...data }` on success, or
`{ success: false, message }` on error.

### Auth — `/api/auth`

| Method | Route              | Access  | Body / Notes |
|--------|---------------------|---------|---------------|
| POST   | `/register`         | Public  | `{ name, email, password, role, ...roleFields, adminCode? }` — `role` is `student`\|`teacher`\|`admin`. Admin registration requires a matching `adminCode`. |
| POST   | `/login`             | Public  | `{ email, password, role? }` — if `role` is sent and doesn't match the account, login is rejected. |
| POST   | `/logout`            | Private | Clears the auth cookie. |
| GET    | `/me`                | Private | Returns the logged-in user's profile. |
| PUT    | `/me`                | Private | Update own profile (name, course, department, etc). |
| PUT    | `/change-password`   | Private | `{ currentPassword, newPassword }` |

### Users — `/api/users` (Admin only)

| Method | Route       | Notes |
|--------|--------------|-------|
| GET    | `/`          | `?role=&search=&page=&limit=` — list/search/filter all users |
| GET    | `/:id`       | Get one user |
| POST   | `/`          | Admin creates a user directly (any role) |
| PUT    | `/:id`       | Update role, profile fields, or `isActive` (deactivate without deleting) |
| DELETE | `/:id`       | Delete a user (can't delete your own logged-in account) |

### News — `/api/news`

| Method | Route   | Access            | Notes |
|--------|----------|-------------------|-------|
| GET    | `/`      | Public            | `?category=&page=&limit=&includeUnpublished=true` (drafts only visible to logged-in staff) |
| GET    | `/:id`   | Public            | |
| POST   | `/`      | Admin, Teacher    | `{ title, excerpt, content, category, image, status }` |
| PUT    | `/:id`   | Admin, Teacher    | |
| DELETE | `/:id`   | Admin             | |

### Events — `/api/events`

| Method | Route              | Access            | Notes |
|--------|---------------------|-------------------|-------|
| GET    | `/`                  | Public            | `?status=Upcoming` |
| GET    | `/:id`               | Public            | |
| POST   | `/`                  | Admin, Teacher    | `{ title, description, date, time, location, image, status }` |
| PUT    | `/:id`               | Admin, Teacher    | |
| DELETE | `/:id`               | Admin             | |
| POST   | `/:id/register`      | Private (any)     | Registers the logged-in user for the event |
| DELETE | `/:id/register`      | Private (any)     | Cancels the registration |

### Gallery — `/api/gallery`

| Method | Route   | Access            | Notes |
|--------|----------|-------------------|-------|
| GET    | `/`      | Public            | `?category=Sports` |
| GET    | `/:id`   | Public            | |
| POST   | `/`      | Admin, Teacher    | `{ category, image, caption }` |
| PUT    | `/:id`   | Admin, Teacher    | |
| DELETE | `/:id`   | Admin             | |

### Contact — `/api/contact`

| Method | Route        | Access  | Notes |
|--------|---------------|---------|-------|
| POST   | `/`           | Public  | `{ name, email, subject, message }` |
| GET    | `/`           | Admin   | `?status=Unread` — view inbox |
| PUT    | `/:id/read`   | Admin   | Mark a message as read |
| DELETE | `/:id`        | Admin   | |

### Notices — `/api/notices`

| Method | Route   | Access  | Notes |
|--------|----------|---------|-------|
| GET    | `/`      | Public, audience-filtered | Guests see `audience=All` only. Logged-in students see `All`+`Student`; teachers see `All`+`Teacher`; admins see everything (or filter with `?audience=`). |
| GET    | `/:id`   | Public  | |
| POST   | `/`      | Admin   | `{ title, message, audience, priority, expiresAt? }` — `audience` is `All`\|`Student`\|`Teacher`, `priority` is `Normal`\|`Important`\|`Urgent` |
| PUT    | `/:id`   | Admin   | |
| DELETE | `/:id`   | Admin   | |

### Dashboards — `/api/dashboard`

| Method | Route       | Access  | Returns |
|--------|--------------|---------|----------|
| GET    | `/admin`     | Admin   | Site-wide stats + 5 most recent news articles |
| GET    | `/teacher`   | Teacher | The teacher's own news posts + events + registration counts |
| GET    | `/student`   | Student | Upcoming events, the student's registered events, latest news |

### Upload — `/api/upload`

| Method | Route | Access         | Notes |
|--------|--------|----------------|-------|
| POST   | `/`    | Admin, Teacher | `multipart/form-data` with field name `image`. Returns `{ url }` to use as the `image` field on news/events/gallery. Max 5MB, jpg/png/webp/gif only. |

## Connecting the React frontend

1. In the frontend project, set the API base URL (e.g. via `.env`:
   `VITE_API_URL=http://localhost:5000/api`) and use `axios` with
   `withCredentials: true` so the httpOnly auth cookie is sent automatically:
   ```js
   axios.defaults.withCredentials = true
   ```
2. Replace the mock `navigate(...)` calls in `Login.jsx` / `Register.jsx`
   with real requests, e.g.:
   ```js
   await axios.post(`${API_URL}/auth/login`, { email, password, role })
   navigate(`/${role}/dashboard`)
   ```
3. Logout button: `await axios.post(`${API_URL}/auth/logout`)`, then
   redirect to `/login`.
4. Add a `<ProtectedRoute role="admin">` style wrapper in the frontend
   that calls `GET /api/auth/me` on mount and redirects to `/login` if
   the request fails or the role doesn't match the route.
5. CORS is already configured in `server.js` to allow credentials from
   `CLIENT_URL` in your `.env`.

## Security notes for production

- Set `NODE_ENV=production` so cookies are sent with `secure: true` and
  `sameSite: 'none'` (required if frontend and backend are on different
  domains over HTTPS).
- Rotate `JWT_SECRET` and `ADMIN_INVITE_CODE` away from the example values.
- Consider rate-limiting `/api/auth/login` and `/api/auth/register`
  (e.g. with `express-rate-limit`) to slow down brute-force attempts.
- Validate/sanitize all input more strictly (e.g. with `zod` or `joi`)
  before going live — this backend includes baseline validation only.
