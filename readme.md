# Me-API Playground – Backend

A RESTful API that exposes my personal profile, skills, education, and projects
in a structured and queryable way.

This project is built as part of the **Me-API Playground (Track A)**
assessment. The API represents a single user profile (me) and allows
querying skills, projects, education, and searching across profile data.

---

## 🚀 Live URLs

- **Base API URL:** https://me-api-playground-unpi.onrender.com
- **Frontend URL:** https://me-api-playground-ui.netlify.app/
- **Health Check:** https://me-api-playground-unpi.onrender.com/health

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Security:** express-rate-limit
- **Configuration:** dotenv
- **CORS:** Enabled
- **Frontend:** React (Vite), TailwindCSS

---

## 📐 Architecture Overview

The backend follows a simple layered architecture:

- **Routes** – Define API endpoints
- **Controllers** – Handle request logic and responses
- **Models** – Mongoose schemas for MongoDB
- **Server** – App initialization and database connection

The API is intentionally designed to manage a **single profile**
document representing one user.

## 📁 Folder Structure

.
├── controllers/
│ └── profile.controller.js
├── models/
│ └── profile.model.js
├── routes/
│ └── profile.routes.js
├── postman/
│ └── me-api-playground.postman_collection.json
├── server.js
├── package.json
├── .env
└── README.md

---

## 📊 Data Model (Profile)

The Profile schema stores the following information:

### Basic Info

- **name** (String)
- **email** (String)

### Education

- course
- institute
- startedAt
- completedAt
- ongoing

### Skills

- Array of skill names (String)

### Projects

- title
- description
- skills[]
- links (github, live)

### Work

- role
- company
- duration

### Links

- github
- linkedin
- portfolio

The API maintains a single profile document using an
**upsert-based design**.

## 🔗 API Endpoints

### Health Check

GET /health

Response:
{
"status": "ok"
}

---

### Get Profile

GET /profile

Returns the complete profile document.

---

### Create or Update Profile

PUT /profile

Creates or updates the single profile document using an upsert strategy.

---

### Get Projects by Skill

GET /profile/projects?skill=react

Returns projects filtered by the given skill
(case-insensitive match).

---

### Get Top Skills

GET /profile/skills/top

Returns the primary skills listed in the profile.

---

### Search Profile

GET /profile/search?q=node

Searches across:

- Skills
- Project titles
- Project descriptions
- Project skills

## 🧪 API Testing

A Postman collection is included in the repository.

**Location:**
postman/me-api-playground.postman_collection.json

The collection contains requests for:

- Health check
- Get profile
- Create / update profile
- Get projects by skill
- Get top skills
- Search profile

## 🔧 Example cURL Requests

Health Check:
curl https://me-api-playground-unpi.onrender.com/health

Get Profile:
curl https://me-api-playground-unpi.onrender.com/profile

Get Projects by Skill:
curl "https://me-api-playground-unpi.onrender.com/profile/projects?skill=react"

Search Profile:
curl "https://me-api-playground-unpi.onrender.com/profile/search?q=node"

## ⚙️ Local Setup

1. Clone the repository
2. Install dependencies:
   npm install
3. Create a `.env` file with:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
4. Start the server:
   npm start

## ⚠️ Known Limitations

- Only a single profile is supported (by design)
- No authentication or authorization
- CORS is open for simplicity
- No automated tests included

## 👤 Author

**Sudhir Sharma**  
MCA Student (Lovely Professional University)  
Backend / Full-Stack Developer | Open to Internship Opportunities
