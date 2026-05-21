# Smart Task Management Platform

A clean, responsive full-stack website containing a React frontend dashboard and a Node.js Express backend API database. No Maven, Spring Boot, or microservice wrappers are included.

---

## Folder Structure
- **`database/`**: Contains PostgreSQL SQL setup script.
- **`backend/`**: Node.js Express backend REST API server (Port `8080`).
- **`frontend/`**: Vite + React website application dashboard (Port `3000`).

---

## How to Setup and Run the App

### Step 1: PostgreSQL Database Setup
1. Open your PostgreSQL terminal (or pgAdmin / client tool).
2. Create a database named `smart_task_manager`:
   ```sql
   CREATE DATABASE smart_task_manager;
   ```
3. Connect to it, and run the SQL instructions inside `database/schema.sql` to create the tables.

---

### Step 2: Start the Backend API Server
1. Open a terminal windows command line.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The Node/Express server will run on* **`http://localhost:8080`**.
   *(Note: The default connection string connects to PostgreSQL on `localhost:5432` with username `postgres` and password `postgres`. To change this, edit `backend/db.js` or set a `DATABASE_URL` environment variable).*

---

### Step 3: Start the Frontend React Web App
1. Open another terminal window.
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to **`http://localhost:3000`** to view and use the website!
