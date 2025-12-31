# Syriavana Backend

## Stack

- Node.js
- Express
- JWT
- bcryptjs
- CORS

## Setup

- Install Node.js 18+
- In `server`, run `npm install`
- Create `.env` with `PORT=3001` and `JWT_SECRET=change-me`
- Start with `npm run start`

## Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/sites`
- `GET /api/sites/:id`
- `POST /api/users/:id/favorites` body `{ siteId, action?: "remove" }`
- `GET /api/trips`
- `GET /api/trips/:id`
- `POST /api/trips/:id/book` body `{ numberOfPeople, companions?, paymentMethod?, notes?, busType? }`
- `GET /api/bookings/my`
- `POST /api/bookings/:id/cancel`
- `POST /api/reviews` body `{ tripId, rating, comment? }`
- `GET /api/admin/*` requires admin JWT

## Auth

- `Authorization: Bearer <token>`
- Register then login to receive token

## Notes

- Data is in-memory for development
- Replace with MongoDB models in production
