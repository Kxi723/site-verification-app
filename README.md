# 📃 Job Completion System

> A robust, full-stack reporting website designed for contractors to submit job completion data. This system eliminates fraudulent reporting by enforcing real-time camera capture.

## 📖 Background & Problem Statement

Traditional reporting methods often suffer from several critical issues that I aimed to solve with this project:

- **1. Fraudulent Submissions:** Contractors might upload duplicate photos from their gallery to impersonate real-time progress.

- **2. Resource Crashes & Data Loss:** Opening the camera on mobile devices is resource-intensive and often triggers a browser refresh, causing users to lose all typed form data.

- **3. Duplicate Records:** Poor network feedback often leads users to submit the same form multiple times, creating redundant data in the database.

## ⚙️ How It Works (The Logic)

### 1. `Anti-Fraud Camera Verification`
To guarantee the authenticity of work, the system bypasses the traditional "file upload" method:
- **Mandatory Live Capture:** The system utilizes the HTML5 MediaDevices API to call the device camera directly.
- **No Gallery Access:** Users are restricted from selecting photos from their phone, ensuring the evidence is captured on-site and in real-time.

### 2. `Intelligent Data Handling & Protection`
- **Auto-Timestamping:** The application automatically retrieves and fills the current date and time to maintain chronological accuracy, while still allowing for manual adjustments.
- **Session Persistence:** To combat page refreshes caused by high memory usage (camera activation), **Session Storage** is implemented to save all input data. If the page reloads, the contractor's progress is automatically restored.
- **Strict Validation:** Every field is mandatory; the system triggers a warning if any information is missing, ensuring a complete dataset for every entry.

### 3. `Submission Safety Buffer`
To prevent the "Double-Click" redundancy issue:
- **Success Stay-Page:** Upon a successful upload, the system does not immediately redirect. Instead, it holds the user on a "Success" confirmation screen.
- **Manual Acknowledgement:** The user must manually click a button to return to the dashboard, ensuring they are fully aware the submission was successful before attempting another.

## 📁 Repository Structure

```text
/
├── backend/                  # PHP REST API Endpoints
│   ├── config/               # Database and environment configurations
│   └── submission/           # API handlers for data writing and retrieval
├── frontend/                 # React Application
│   ├── src/                  # Components, Contexts (Session handling), and Hooks
│   ├── package.json          # Dependency management
│   └── vite.config.ts        # Vite configuration
└── README.md                 # Project Documentation
```

## 🚀 Quick Start Guide

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
2. Configure your MySQL database and run the initial setup script to create the necessary tables.
3. Update your database configuration (e.g., inside `backend/config/`) to match your local MySQL credentials.
4. Host the `backend` folder on your local server (e.g., `http://localhost/backend`) so the frontend API calls can reach it.

### 3. API Configuration

To link the frontend and backend, configure your local environment API base URL in the frontend:
```typescript
// Example: src/app/utils/api.ts or related config
VITE_READ_FROM_MYSQL = "/backend/submission/read_data.php"";
```