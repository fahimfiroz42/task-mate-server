# 🚀 TaskMate Backend

## 📌 Short Description
TaskMate Backend is a robust and scalable server application that powers the TaskMate task management system. It provides APIs for user authentication, task creation, updating, deletion, and real-time task management.

## 🔗 Live Links
- **Backend API Base URL**: `https://your-backend-url.com`
- **Frontend Repository**: [TaskMate Frontend](https://github.com/your-repo/frontend)

## 📦 Dependencies
The backend is built using **Node.js** and **Express.js**, with the following dependencies:

```json
{
  "express": "^4.18.2",
  "mongoose": "^6.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "morgan": "^1.10.0",
  "helmet": "^6.1.5"
}
```

## 🛠 Installation Steps
Follow these steps to set up the backend locally:

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/backend.git
   cd backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**
   ```sh
   npm start
   ```

5. **API will run at** `http://localhost:5000`

## 💻 Technologies Used
- **Node.js** - JavaScript runtime for building scalable applications.
- **Express.js** - Lightweight and fast backend framework.
- **MongoDB & Mongoose** - NoSQL database and ODM for database interactions.
- **JWT Authentication** - Secure user authentication with JSON Web Tokens.
- **CORS & Helmet** - Security enhancements for API protection.
- **Bcrypt.js** - Password hashing for user authentication.
- **Morgan** - Logger middleware for better request tracking.

## 📜 API Endpoints
### **User Authentication**
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user and return JWT token

### **Task Management**
- `GET /tasks` - Retrieve user tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PUT /tasks/reorder` - Reorder tasks

## ✨ Contributing
Feel free to contribute! Fork the repository, create a new branch, and submit a PR with your changes.

## 📄 License
This project is licensed under the **MIT License**.

---

💡 _Stay organized and productive with TaskMate!_ 🚀
