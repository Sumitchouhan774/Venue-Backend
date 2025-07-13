# Venue Booking System

A comprehensive RESTful API for managing venue bookings with user authentication, role-based access control, and booking management features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Data Models](#data-models)
- [Authentication](#authentication)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)

## 🎯 Overview

The Venue Booking System is a Node.js/Express API that allows:
- **Venue Owners** to list their venues, manage bookings, and block dates
- **Customers** to browse venues and make bookings
- Secure authentication with JWT tokens
- Role-based access control (Owner/Customer)

## ✨ Features

- **User Management**
  - User registration and login
  - Role-based authentication (Owner/Customer)
  - JWT token-based security

- **Venue Management**
  - Create and list venues
  - Set pricing and amenities
  - Block dates for maintenance/unavailability

- **Booking System**
  - Create bookings with date validation
  - View personal bookings
  - Automatic price calculation
  - Booking status management

- **Security**
  - Password hashing with bcrypt
  - JWT authentication
  - Protected routes with middleware

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs for password hashing
- **Validation**: Mongoose schema validation
- **Other**: CORS, body-parser, dotenv

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd venue-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/venue-booking
   JWT_SECRET=your-jwt-secret-key
   ```

4. **Start the server**
   ```bash
   node app.js
   ```

The server will start on `http://localhost:5000`

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 5000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |

## 🛤 API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |

### Venue Routes (`/api/venues`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/venues` | Get all venues | No | - |
| POST | `/api/venues` | Create new venue | Yes | Owner |
| POST | `/api/venues/:id/block` | Block dates for venue | Yes | Owner |
| GET | `/api/venues/:id/bookings` | Get venue bookings | Yes | Owner |

### Booking Routes (`/api/bookings`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/bookings` | Create new booking | Yes | Any |
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes | Any |

## 📊 Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['owner', 'customer'], default: 'customer'),
  createdAt: Date
}
```

### Venue Model
```javascript
{
  owner: ObjectId (ref: User, required),
  name: String (required),
  description: String,
  capacity: Number,
  location: String,
  pricePerDay: Number (required),
  amenities: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  venue: ObjectId (ref: Venue, required),
  user: ObjectId (ref: User, required),
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  totalPrice: Number (required),
  createdAt: Date
}
```

### BlockedDate Model
```javascript
{
  venue: ObjectId (ref: Venue, required),
  startDate: Date (required),
  endDate: Date (required),
  reason: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Customer**: Can view venues and create bookings
- **Owner**: Can create venues, manage bookings, and block dates

## 💡 Usage Examples

### Register a New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create a Venue (Owner only)
```bash
POST /api/venues
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Grand Hall",
  "description": "Beautiful venue for events",
  "capacity": 200,
  "location": "Downtown",
  "pricePerDay": 500,
  "amenities": ["WiFi", "Parking", "Catering"]
}
```

### Create a Booking
```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "venue": "venue-id",
  "startDate": "2025-08-01",
  "endDate": "2025-08-03"
}
```

### Block Dates (Owner only)
```bash
POST /api/venues/:id/block
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDate": "2025-07-15",
  "endDate": "2025-07-20",
  "reason": "Maintenance"
}
```

## 📁 Project Structure

```
venue-booking-system/
├── app.js                 # Main application file
├── db.js                  # Database connection
├── package.json           # Dependencies and scripts
├── controllers/           # Request handlers
│   ├── authController.js      # Authentication logic
│   ├── bookingController.js   # Booking management
│   └── venueController.js     # Venue management
├── middleware/            # Custom middleware
│   └── auth.js               # Authentication middleware
├── models/                # Database models
│   ├── BlockedDate.js        # Blocked dates schema
│   ├── Booking.js            # Booking schema
│   ├── User.js               # User schema
│   └── Venue.js              # Venue schema
├── routes/                # API routes
│   ├── authRoutes.js         # Authentication routes
│   ├── bookingRoutes.js      # Booking routes
│   └── venueRoutes.js        # Venue routes
└── services/              # Business logic
    └── venueService.js       # Venue-related services
```

## 🚀 Getting Started

1. Ensure MongoDB is running on your system
2. Install dependencies: `npm install`
3. Create `.env` file with required environment variables
4. Start the server: `node app.js`
5. Test the API using Postman or similar tool

## 📝 Notes

- All dates should be in ISO 8601 format (YYYY-MM-DD)
- Passwords are automatically hashed during user registration
- JWT tokens expire after 7 days
- End dates must be after start dates for bookings and blocked dates
- Only venue owners can manage their own venues and bookings
