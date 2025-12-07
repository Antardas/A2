# Vehicle Rental System API

Live URL: `http://localhost:5000`

## Overview

Backend REST API for managing a vehicle rental system. It handles:
- User registration, login and role-based access (admin, customer)
- Vehicle inventory with availability tracking
- Booking creation, cancellation and returns with price calculation

## Features

- Authentication with JWT and bcrypt-based password hashing
- Role-based authorization (admin and customer)
- CRUD operations for vehicles
- User management with admin and self-service update
- Booking management with:
  - Automatic total price calculation
  - Vehicle availability updates
  - Status handling: `active`, `cancelled`, `returned`
- PostgreSQL database with schema initialization on startup
- Centralized error handling with consistent JSON responses

## Technology Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL (via `pg`)
- bcryptjs
- jsonwebtoken
- dotenv

## Setup

### Prerequisites

- Node.js (LTS)
- PostgreSQL instance

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
CONNECTION_STR=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 3. Database

The application will automatically create required tables on startup using the connection string.
Make sure the database in `CONNECTION_STR` already exists.

### 4. Development

```bash
npm run dev
```

Server runs by default on:

```text
http://localhost:5000
```

### 5. Build and production

```bash
npm run build
npm start
```

## Usage

### Authentication

- `POST /api/v1/auth/signup` – Register a new user
- `POST /api/v1/auth/signin` – Login and receive JWT token

Include JWT for protected routes:

```http
Authorization: Bearer <token>
```

### Main Resource Groups

- **Vehicles** – `/api/v1/vehicles`
- **Users** – `/api/v1/users`
- **Bookings** – `/api/v1/bookings`

Detailed request/response formats are in `API_REFERENCE.md` and `api.http` examples in the project root.
