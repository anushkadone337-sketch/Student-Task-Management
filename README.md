# Student Task Management System

A responsive full-stack task manager built with React + Vite, Node.js + Express, and MongoDB (Mongoose).

## Features
- Dashboard summary: total, pending, in-progress, and completed tasks
- Create tasks with title, description, priority, due date, and status
- Edit tasks
- Change task status (Pending / In Progress / Completed)
- Mark tasks completed with a one-click action
- Delete tasks
- Search and filter tasks
- Responsive layout for laptop, tablet, and mobile
- MongoDB persistence through the Express API

## Requirements
- Node.js 18 or newer
- MongoDB running locally OR a MongoDB Atlas connection string
- VS Code (recommended)

## 1. Start MongoDB
Choose one:
- Local MongoDB: make sure the MongoDB service is running.
- MongoDB Atlas: create a free cluster and copy its connection string.

## 2. Configure backend
Open a terminal in the `backend` folder:

```bash
npm install
```

Copy `.env.example` to `.env` and set `MONGO_URI`.

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Example local connection:
```env
MONGO_URI=mongodb://127.0.0.1:27017/student_task_manager
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

You should see `MongoDB connected` and `API running on http://localhost:5000`.

## 3. Start frontend
Open a second terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open the URL shown by Vite, usually http://localhost:5173.

## Important
- Keep both terminals running while using the app.
- Backend API health check: http://localhost:5000/api/health
- If MongoDB is not running or `MONGO_URI` is incorrect, the app will show an API/database connection message.
- Do not upload your `.env` file or database credentials to GitHub.

## Project structure
```text
student-task-management/
  backend/
    src/
      config/db.js
      controllers/taskController.js
      middleware/errorHandler.js
      models/Task.js
      routes/taskRoutes.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
      lib/
      App.jsx
      main.jsx
      styles.css
    index.html
    package.json
    vite.config.js
```

