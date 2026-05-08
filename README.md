# OrderFlow — WhatsApp Order Manager SaaS

A lightweight order management system built for Instagram and WhatsApp sellers in Pakistan. Track customer orders, manage delivery statuses, and view sales insights — all from a simple, mobile-first web app.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, Tailwind CSS v4 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (Access + Refresh Tokens) |

## 📁 Project Structure

```
OrderManagementSystem/
├── backend/               # Express.js API server
│   ├── config/            # Database & environment config
│   ├── controllers/       # Route handlers
│   ├── middleware/         # Auth, validation, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── utils/             # Helpers (logger, response, order number)
│   ├── validators/        # Joi validation schemas
│   └── server.js          # App entry point
├── frontend/              # React SPA
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── context/       # React Context (Auth)
│       ├── pages/         # Page-level components
│       ├── services/      # API service layer
│       └── utils/         # Formatters & constants
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/OrderManagementSystem.git
cd OrderManagementSystem
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/profile` | Get current user profile |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List orders (paginated, filterable) |
| POST | `/api/orders` | Create a new order |
| GET | `/api/orders/stats` | Dashboard statistics |
| GET | `/api/orders/:id` | Get a single order |
| PUT | `/api/orders/:id` | Update an order |
| PATCH | `/api/orders/:id/status` | Quick status update |
| DELETE | `/api/orders/:id` | Delete an order |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## 🔒 Security Features

- JWT authentication with access/refresh tokens
- Password hashing with bcrypt (12 salt rounds)
- Input validation with Joi
- NoSQL injection prevention (express-mongo-sanitize)
- Security headers (Helmet)
- Rate limiting (100 req/15min general, 20 req/15min auth)
- CORS whitelist

## 📱 Features

- **Dashboard** — Total orders, pending, delivered, revenue summary
- **Order Management** — Full CRUD with search, filter, and pagination
- **Status Tracking** — Pending → Confirmed → Shipped → Delivered / Cancelled
- **Mobile Responsive** — Card layout on mobile, table on desktop
- **Auto Order Numbers** — Human-readable sequential numbers (ORD-00001)

## 🚢 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add `VITE_API_URL` environment variable

### Backend → Render
1. Create a new Web Service on Render
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `.env.example`

### Database → MongoDB Atlas
1. Create a free cluster at [mongodb.com](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist your IP (or 0.0.0.0/0 for Render)
4. Copy the connection string to `MONGO_URI`

## 📄 License

MIT
