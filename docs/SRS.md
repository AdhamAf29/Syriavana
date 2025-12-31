Software Requirements Specification (SRS)

Project Name: Syriavana — An Electronic Platform for Exploring Archaeological & Touristic Sites in Syria and Managing Organized Trips

Technologies Used:

Frontend: Vue.js
Backend: Node.js + Express
Database: MongoDB
Authentication: Email/password login

1. Introduction

1.1 Purpose of the Document

This document provides a complete Software Requirements Specification for the Syriavana platform. It defines functional and non-functional requirements, data models, UI structure, and backend API endpoints. It serves as a reference for developers, designers, testers, and stakeholders throughout the project lifecycle.

1.2 System Scope

Syriavana is an interactive web platform designed to showcase archaeological and touristic locations in Syria and to enable users to browse, explore, and book organized trips offered by registered travel companies. The platform provides multilingual support (starting with Arabic), with a clean and accessible interface.

1.3 Definitions and Terminology

Trip: A published travel program created by an approved tourism company.
Booking: A reservation made by a user for a trip.
Company: A verified travel agency that can publish trips.
Admin: Full-access role responsible for managing site content, users, trips, and reviews.

2. Functional Requirements

2.1 User Authentication & Profile Management

Users can register using their email and password.
Users can log in, update profile information, and reset their password.
User roles include: guest, regular user, company, and admin.
The email field must be unique.

2.2 Browsing Touristic & Historical Sites

Two dedicated pages: Touristic Sites & Historical Sites, each containing 6 cards (image + short description).
Every site has a details page showing: name, type (archaeological / religious / natural / recreational), full description, images (slider), map location, and average rating.
Users can filter sites by province or type.

2.3 Favorites & Personal Lists

Users can add/remove sites from their favorites.
Users can create personal itineraries containing selected sites.

2.4 Trips & Offers Page

A dedicated Trips page containing 15 trips.
Each trip card includes:
Image
Trip title
Full start & end date
Price
Departure point: always Damascus
Discount label if applicable
A button “Book Now” redirects to booking.

2.5 Booking Process

When clicking Book Now, if the user is not logged in, they are redirected to the login page.
Booking form includes: email, address, phone number, number of passengers, companion details, payment method, bus type, and optional notes.
Clicking Confirm Booking creates a booking in the system.
A notification appears: “Booking successful — Please visit our Damascus office for payment and final details.”
Seats available for the trip are updated automatically.

2.6 User Bookings Page

Shows all trips booked by the logged-in user.
Each booking card includes an “Cancel” button.
Cancelation triggers:
Booking status becomes Cancelled
Seats are restored
A success notification appears: “Your booking has been successfully canceled.”

2.7 User Reviews

Users may only submit reviews for trips they have actually booked.
If a user attempts to review without having a previous booking:
A notification appears: “You must book this trip before leaving a review.”

2.8 Company & Trip Management

Companies can create and manage trips.
They can add: title, description, dates, price, seats, included locations, and images.
Admin must approve or deactivate trips.

2.9 Admin Dashboard

Admins can:
Add/edit/delete touristic & historical sites
Review and approve/reject company trips
Manage users and companies
Moderate reviews

3. Non-functional Requirements

3.1 Performance

Response time: 300–800 ms for standard operations.
System supports 1000 concurrent users initially.

3.2 Security

Passwords must be hashed via bcrypt.
JWT-based authentication with role-based access.
Input validation on frontend & backend.
Protection against: XSS, CSRF, SQL injection (not applicable to MongoDB but input safety still required).

3.3 Scalability

API and frontend decoupled for scaling.
MongoDB optimized for horizontal scaling.

3.4 Backup & Reliability

Daily automatic database backup.

3.5 Accessibility

Full RTL support for Arabic.

4. Data Model (MongoDB Collections)

Users
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  phone: String,
  address: String,
  role: "user" | "company" | "admin",
  favorites: [ObjectId],
  createdAt: Date
}

Sites
{
  _id: ObjectId,
  name: String,
  type: String,
  description: String,
  province: String,
  ratingAverage: Number,
  images: [String],
  location: { lat: Number, lng: Number }
}

Companies
{
  _id: ObjectId,
  name: String,
  description: String,
  phone: String,
  email: String,
  address: String,
  approved: Boolean,
  createdAt: Date
}

Trips
{
  _id: ObjectId,
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  price: Number,
  totalSeats: Number,
  seatsAvailable: Number,
  departurePoint: "Damascus",
  companyId: ObjectId,
  sites: [ObjectId],
  images: [String],
  discount: { amount: Number, active: Boolean },
  active: Boolean,
  createdAt: Date
}

Bookings
{
  _id: ObjectId,
  userId: ObjectId,
  tripId: ObjectId,
  numberOfPeople: Number,
  companions: [ { name: String, age: Number } ],
  paymentMethod: String,
  paymentStatus: String,
  bookingStatus: String,
  bookingDate: Date
}

Reviews
{
  _id: ObjectId,
  userId: ObjectId,
  tripId: ObjectId,
  rating: Number,
  comment: String,
  reviewDate: Date
}

5. API Endpoints (Overview)

POST /api/auth/register — Register
POST /api/auth/login — Login
GET /api/sites — Fetch sites
GET /api/sites/:id — Site details
POST /api/users/:id/favorites — Add to favorites
GET /api/trips — Fetch trips
GET /api/trips/:id — Trip details
POST /api/trips/:id/book — Create booking
POST /api/bookings/:id/cancel — Cancel booking
POST /api/reviews — Submit review
GET /api/admin/* — Admin-only endpoints
