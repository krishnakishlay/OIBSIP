# 🍕 Pizzeriaa

A full-stack pizza ordering web application built with React (Vite) + Node.js (Express) + MongoDB.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Context API |
| Styling | CSS Variables, Custom Design System |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh tokens), bcrypt |
| Payments | Razorpay |
| Deployment | Docker, GitHub Actions |

## Project Structure

```
pizzacraft/
├── frontend/               # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level page components
│   │   ├── context/        # Auth, Cart, Toast context
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API call abstractions
│   │   ├── utils/          # Helpers, validators, constants
│   │   └── styles/         # Global CSS, variables, animations
│   ├── index.html
│   └── vite.config.js
├── backend/                # Node.js + Express API
│   ├── config/             # DB, Razorpay, CORS config
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route definitions
│   ├── controllers/        # Business logic handlers
│   ├── middleware/         # Auth, error, validation middleware
│   ├── utils/              # JWT, email, response helpers
│   └── server.js
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas URI)
- Razorpay account (test keys)

### 1. Clone & install

```bash
git clone https://github.com/yourusername/pizzacraft.git
cd pizzacraft

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Environment variables

```bash
cp .env.example .env
# Fill in your values (see .env.example)
```

### 3. Run development servers

```bash
# Terminal 1 — backend (port 5000)
cd backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd frontend && npm run dev
```

### 4. Run with Docker

```bash
docker-compose up --build
```

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| POST | /api/auth/logout | Invalidate refresh token |
| POST | /api/auth/forgot-password | Send reset email |
| POST | /api/auth/reset-password | Reset with token |

### Pizzas
| Method | Route | Description |
|---|---|---|
| GET | /api/pizzas | Get all pizzas (filter: ?type=veg) |
| GET | /api/pizzas/:id | Get single pizza |

### Orders
| Method | Route | Description |
|---|---|---|
| POST | /api/orders | Create new order |
| GET | /api/orders/my | Get current user's orders |
| GET | /api/orders/:id | Get order by ID |

### Payments
| Method | Route | Description |
|---|---|---|
| POST | /api/payments/create-order | Create Razorpay order |
| POST | /api/payments/verify | Verify Razorpay signature |

## Environment Variables

See `.env.example` for all required variables.

## License

MIT
