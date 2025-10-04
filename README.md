### Event Managment Web Application

A comprehensive platform where **organizers** can create, manage, and sell tickets for events, while **users** can easily discover, book, and attend them.  

🌍 **Live Demo:** [Event Hive](https://event-hive117.vercel.app/) 🚀  

---

## 🚀 Core Functionalities

- **Event Creation & Management**  
  Organizers can list, update, and manage events with ease.

- **User & Organizer Dashboards**  
  Separate dashboards for bookings, profiles, analytics, and event administration.

- **Ticketing & Payments**  
  Secure ticket types, inventory management, and online payment processing.

- **Advanced Features**  
  Collaboration tools, AI chatbot support, QR-based attendance scanning, and ML-driven event recommendations.

---

## 💻 Tech Stack

This project uses the **MERN-adjacent stack (MongoDB, Express, React, Node.js)** with modern tooling:

| Component  | Technology              | Key Dependencies                                                                 | Location                |
|------------|-------------------------|----------------------------------------------------------------------------------|-------------------------|
| **Frontend** | React (Vite)           | Redux Toolkit (State Mgmt), Tailwind CSS (Styling), React Router DOM (Routing), Leaflet/React-Leaflet (Mapping), Recharts (Charts) | `frontend/package.json` |
| **Backend**  | Node.js + Express.js   | Mongoose (MongoDB ODM), Bcryptjs (Hashing), JSON Web Token (Auth), Multer (File Uploads) | `backend/package.json`  |
| **Database** | MongoDB                | Mongoose                                                                         | `backend/package.json`  |

---

## ▶️ Getting Started

The project is divided into **backend (Node.js/Express)** and **frontend (React/Vite)** directories.  

### 1️⃣ Backend Setup

```bash
cd backend
npm install
Start the development server (using nodemon):

bash
Copy code
npm run dev
Runs on: http://localhost:5000 (or process.env.PORT if set)

2️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
Start the React development server:

bash
Copy code
npm run dev
Runs on: http://localhost:5173 (default Vite port)

📝 External Services & APIs
The application integrates with multiple external services:

Service	Dependency / Route	Purpose	Location
AI Chatbot	@google/generative-ai, /api/chatbot	Conversational support powered by Gemini AI	backend/package.json, backend/index.js
Payment Gateway	razorpay	Secure ticket payment processing	backend/package.json
Cloud Storage	cloudinary	Store user and event media (e.g., posters)	backend/package.json
Email/Notifications	nodemailer	Email delivery (account confirmation, tickets)	backend/package.json
Authentication	google-auth-library, /api/oauth	Google OAuth sign-in & registration	backend/package.json, backend/index.js

🔑 Environment Variables
Create a .env file in the backend directory with the following keys:

env
Copy code
# MongoDB
MONGO_URI=

# Authentication
JWT_SECRET=
GOOGLE_CLIENT_ID=

# Payment (Razorpay)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email / Notifications
EMAIL=
PASSWORD=

# AI Chatbot
GEMINI_API_KEY=

# Server
PORT=5000
🌐 Development Environment
Backend → Uses dotenv to load environment variables.

Frontend → Uses Vite for fast builds and hot reloading.

