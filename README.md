# 📃 Job Completion System

> A full-stack, responsive web application designed to streamline and verify contractor job completions. Built as a functional prototype, this system emphasizes **real-time on-site verification** using live camera capture to ensure authentic proof of work.

## 🎯 Overview

This system modernizes field job reporting by allowing contractors to:
- Securely record and submit job completions on-site.
- **Capture real-time team photos directly via the device camera** 📸, bypassing traditional file uploads to prevent fraudulent or outdated image submissions.
- Manage personnel attendance and job accountability.
- View and manage submitted job records through an intuitive dashboard.

## ✨ Key Features

### On-Site Camera Verification
- **Live Camera Integration**: Utilizes the modern HTML5 `MediaDevices` API for real-time camera access.
- **Authentic Verification**: Forces live capture (no gallery uploads) to prove the contractor's real-time presence.
- **Base64 Image Processing**: Images are seamlessly captured, encoded to Base64, and transmitted securely to the backend.

### Job Submission & Management
- **Structured Data Entry**: Submit comprehensive job details including site location, timestamp, and personnel notes.
- **Dashboard Records**: Fetch and display historical job submissions stored securely in the database.
- **Image Retrieval**: Specific endpoints dedicated to efficiently serving BLOB image data to the frontend frontend.

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript (Bootstrapped via Vite)
- **Styling**: Tailwind CSS v4 for utility-first, responsive design
- **Icons & UI**: Lucide React & Sonner (for toast notifications)
- **Routing**: React Router DOM

### Backend
- **Language**: PHP 7.4+
- **Database**: MySQL / MariaDB
- **Architecture**: RESTful API design (`submit_data.php`, `read_data.php`, `read_images.php`)
- **Security**: PDO Prepared Statements for SQL injection prevention

## 🚀 Quick Start

This project is configured for local development and testing.

### 1. Frontend Setup

Navigate to the `frontend` directory and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup

The backend handles the core logic and database interactions.

1. Ensure you have a local PHP environment running (e.g., XAMPP, MAMP, or a standalone PHP server).
2. Configure your MySQL database and run the initial setup script to create the necessary tables (`job_records`, etc.).
3. Update your database configuration (e.g., inside `backend/config/`) to match your local MySQL credentials.
4. Host the `backend` folder on your local server (e.g., `http://localhost/backend`) so the frontend API calls can reach it.

### 3. API Configuration

To link the frontend and backend, configure your local environment API base URL in the frontend:
```typescript
// Example: src/app/utils/api.ts or related config
const API_BASE_URL = "http://localhost/backend";
```

## 📂 Project Structure

```text
/
├── backend/                  # PHP REST API Endpoints
│   ├── config/               # Database and environment configurations
│   └── submission/           # API handlers (read/write data & images)
├── frontend/                 # React Application
│   ├── src/                  # React components, contexts, and hooks
│   ├── package.json          # Dependency management
│   └── vite.config.ts        # Vite configuration
└── README.md                 # Project Documentation
```

## 💡 Developer Notes

This project was developed as an MVP (Minimum Viable Product)/Prototype to demonstrate cross-environment readiness and secure device-feature integration. The codebase effectively bridges a modern JavaScript SPA with a robust, traditional PHP API. While currently configured for a localized setup to facilitate easy sharing and reviewing, the architecture inherently supports standard cloud and containerized deployment workflows (e.g., Vercel + Railway environments).