## Project Overview
BookHub is a full-stack book review platform where users can search for books, view book details, write reviews, rate books, manage their reviews, and report inappropriate content. The application also includes an admin panel for review moderation and user management.

## Features
User Features:User registration and login, JWT-based authentication, Search books, Import books from Google Books API, View book details, Add reviews and ratings, Edit reviews, Delete reviews, View average ratings and total reviews, Report inappropriate reviews, View personal profile, View review history, Open reviewed books directly from review history

Admin Features: Admin dashboard, View platform statistics, Review moderation system, Approve pending reviews, Delete reviews, View reported reviews, Manage users, Delete users, Admin self-delete protection

## Technologies Used
Frontend: Next.js, React.js, Tailwind CSS

Backend:Node.js, Express.js

Database: MongoDB, Mongoose

Authentication: JWT (JSON Web Tokens), bcryptjs

##  Installation
Clone the repository:
git clone

cd project-folder

Install backend dependencies:
cd backend
npm install

Install frontend dependencies:
cd frontend
npm install

## Environment Variables
Create a .env file inside the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

GOOGLE_BOOKS_API_KEY=your_google_book_api

## Create Admin Account
Navigate to the backend folder and run:
npm run seedAdmin.js
This creates the default admin account.

## Running the Project
Start the backend server:
cd backend
npm start

Backend runs on:
http://localhost:5000

Start the frontend server:
cd frontend
npm run dev

Frontend runs on:
http://localhost:3000

