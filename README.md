# Mat-task-backend
📘 Project Overview
This project is a RESTful API built for a Chapter Performance Dashboard — part of a backend assessment task by MathonGo. It includes endpoints to upload, retrieve, filter, and paginate chapters, along with Redis-based caching and rate limiting for performance optimization.

🧰 Tech Stack
Node.js & Express.js

MongoDB with Mongoose

Redis (for caching and rate limiting)

Multer (for file uploads)

Postman (for API testing)

🔥 Features Implemented
✅ Upload chapters via JSON file (admin only)

✅ Filter chapters by class, unit, status, subject, weakChapters

✅ Pagination with page and limit query params

✅ Caching of chapter list using Redis (expires in 1 hour)

✅ Cache invalidation on adding a new chapter

✅ Rate limiting: max 30-40 requests per minute per IP using Redis

✅ Clean, modular code with centralized error handling

✅ Environment-configurable with .env support

📂 API Endpoints
POST /api/v1/chapters
Upload chapter data using a .json file.

Requires x-admin-key header.

Content-Type: multipart/form-data

Returns:

✅ Uploaded chapters

❌ List of chapters that failed validation

GET /api/v1/chapters
Returns a filtered and paginated list of chapters.

Query Parameters:
class

unit

status

subject

weakChapters (true/false)

page and limit

GET /api/v1/chapters/:id
Returns a specific chapter by its MongoDB _id.

⚙️ Environment Variables
Create a .env file and define:

PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=redis://localhost:6379
ADMIN_KEY=your_secret_admin_key
✅ See .env.example for reference.

🚀 Deployment
🔗 Live API: 


Includes:

Sample upload request

Filtered fetch examples

Individual chapter retrieval

💡 How to Run Locally
bash
Copy
Edit
git clone https://github.com/akashmane907/Mat-task-backend
cd your-repo-name
npm install
npm run dev
