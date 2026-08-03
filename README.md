# CraftSite Backend

Backend API for **CraftSite** — a drag-and-drop website builder. Handles authentication, project storage (page/component trees), file uploads, publishing, and admin/subscription management for the [CraftSite frontend](../interactive-website-builder).

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (httpOnly cookies) + bcrypt
- **File Storage:** Cloudinary (via Multer)
- **Testing:** Postman

## Features

- 🔐 **Authentication** — register, login, logout, forgot/reset password, change password, update profile
- 📁 **Projects** — full CRUD for user projects (pages + nested component trees), publish/preview
- 🖼️ **File Uploads** — images, PDFs, Excel, and JSON files via Cloudinary
- 👑 **Admin Controls** — role-based access, user management, manual plan overrides
- 💳 **Subscription Limits** — free-tier project cap (lifetime, not just active count), plan expiry handling

## Project Structure

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── cloudinary.js      # Cloudinary config
│   └── plans.js           # Subscription plan definitions (limits, pricing)
├── models/
│   ├── userModel.js
│   └── projectModel.js
├── controller/
│   ├── authController.js
│   ├── projectController.js
│   ├── userController.js
│   └── uploadController.js
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── userRoutes.js
│   └── uploadRoutes.js
├── middleware/
│   ├── authMiddleware.js   # protect, restrictTo
│   ├── upload.js           # Multer + Cloudinary storage config
│   ├── validateProject.js
│   └── errorHandler.js
├── utils/
│   ├── generateToken.js
│   └── checkPlanExpiry.js
└── app.js

```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (free tier is fine)

### Installation

```bash
git clone <repo-url>
cd craftSite-backend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

> Generate a secure `JWT_SECRET` with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Run the server

```bash
node server.js
# or, with nodemon:
npm run dev
```

Server runs at `http://localhost:5000`. Health check: `GET /`

## API Overview

### Auth — `/api/auth`
| Method | Endpoint | Access |
|---|---|---|
| POST | `/register` | Public |
| POST | `/login` | Public |
| POST | `/forgot-password` | Public |
| POST | `/reset-password/:token` | Public |
| POST | `/logout` | Protected |
| GET | `/me` | Protected |
| PUT | `/change-password` | Protected |
| PUT | `/update-details` | Protected |

### Projects — `/api/projects`
| Method | Endpoint | Access |
|---|---|---|
| POST | `/` | Protected |
| GET | `/` | Protected (own projects) |
| GET | `/:id` | Protected (owner only) |
| PUT | `/:id` | Protected (owner only) |
| DELETE | `/:id` | Protected (owner only) |
| POST | `/:id/publish` | Protected (owner only) |
| GET | `/:id/preview` | Public |

### Users (Admin) — `/api/user`
| Method | Endpoint | Access |
|---|---|---|
| GET | `/` | Admin only |
| GET | `/:id` | Admin only |
| PUT | `/:id/role` | Admin only |
| PUT | `/:id/plan` | Admin only |
| DELETE | `/:id/delete-user` | Admin only |

### Upload — `/api/upload`
| Method | Endpoint | Access |
|---|---|---|
| POST | `/` | Protected (`multipart/form-data`, field name: `file`) |

## Authentication Flow

1. Login issues a signed JWT stored as an **httpOnly cookie** (not accessible to frontend JS — XSS-resistant).
2. `protect` middleware verifies the token on every protected route and attaches the real user to `req.user`.
3. `restrictTo("admin")` middleware layers on top of `protect` for admin-only routes.
4. Frontend requests must use `credentials: "include"` so the cookie is sent cross-origin.

## Data Model Notes

- `Project.pages[].canvasItems` uses `mongoose.Schema.Types.Mixed` to store the recursive component tree (Section → Grid → gridcell → Heading/Text/Button/etc.) exactly as produced by the frontend builder — no rigid schema imposed on nested content.
- `Project.pages` is drafted continuously (`pages`) separately from what's live (`publishedPages`), set only when `/publish` is called.
- Free-tier limits are enforced against `User.projectsCreatedCount`, a **lifetime counter that never decrements on delete** — prevents create/delete loopholes around the plan limit.

## Testing

A Postman collection covering all endpoints (auth, projects, uploads, admin) is available in [`/postman`](./postman). Import both the collection and environment file, set `base_url` to your local server, and run requests in this order for a full regression pass:

```
Register → Login → Me → Create Project → Update Project →
Publish → Preview → Delete Project → Change Password → Logout
```

## Roadmap

- [ ] Real payment integration (Stripe/Razorpay) for plan upgrades
- [ ] Email delivery for password reset (currently logs token to console)
- [ ] Automated ownership-check middleware to reduce repetition across project routes
- [ ] Rate limiting on auth routes

## License

Private project — not licensed for public use.
