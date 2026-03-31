# Contractor Job Completion System

A comprehensive web application for managing contractor job completions with **real-time camera verification** and automatic sync to Huawei ISC system.

## 🎯 Overview

This system streamlines the process of:
- Recording job completions at contractor sites
- **Capturing real-time team photos via device camera** 📸
- Managing personnel accountability
- Syncing job data to Huawei ISC for billing verification

## ✨ Key Features

### Job Submission
- ✅ Submit job completion details with required fields
- 📸 **Real-time camera capture for team photos (no file uploads)**
- 👥 Track team personnel on each job
- 📝 Add completion notes and observations

### Camera Verification
- 📷 Live camera access with front/back camera switching
- 🎯 Real-time preview before capture
- 🔄 Retake capability for perfect shots
- ✅ Authentic on-site verification (no old/stock photos)

### Job Records
- 🔍 Search and filter all job records
- 📥 Export data to CSV
- 🔄 Manual sync retry for failed jobs
- 📊 View sync status at a glance

### Huawei Integration
- 🚀 Automatic sync on job submission
- 📡 RESTful API integration
- 📋 Sync logging and error tracking
- 🔁 Manual retry capability

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **MediaDevices API** for camera access
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend (PHP)
- **PHP 7.4+** with PDO
- **MySQL/MariaDB** database
- **RESTful API** design
- **Base64 image handling**
- **Huawei ISC** API integration

## 📁 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Layout.tsx              # Main layout with navigation
│   │   │   ├── JobSubmissionPage.tsx   # Job submission form
│   │   │   ├── JobRecordsPage.tsx      # Job records list
│   │   │   ├── TeamManagementPage.tsx  # Team photo management
│   │   │   └── ui/                     # Reusable UI components
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── api.ts                  # API integration layer
│   │   │   └── mockData.ts             # Demo data
│   │   ├── App.tsx                     # Root component
│   │   └── routes.tsx                  # Route configuration
│   └── styles/                         # CSS files
├── PHP_BACKEND_GUIDE.md               # Complete PHP backend docs
├── SYSTEM_DOCUMENTATION.md             # Full system documentation
└── README.md                           # This file
```

## 🚀 Quick Start

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

See **[PHP_BACKEND_GUIDE.md](PHP_BACKEND_GUIDE.md)** for complete backend setup instructions.

**Quick Steps**:
1. Set up MySQL database
2. Create database tables (SQL in guide)
3. Configure PHP environment
4. Set up API endpoints
5. Configure Huawei ISC credentials
6. Set file upload permissions

## 📖 Documentation

### Main Documentation Files

- **[CAMERA_IMPLEMENTATION.md](CAMERA_IMPLEMENTATION.md)** - Camera capture implementation details
- **[SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)** - Complete system overview, workflows, and features
- **[PHP_BACKEND_GUIDE.md](PHP_BACKEND_GUIDE.md)** - Full PHP backend implementation guide

### Key Innovation: Real-Time Camera Verification

#### Why Camera-Only?
- **Authentic Verification** - Photos must be taken at job site in real-time
- **Fraud Prevention** - No ability to reuse old/stock photos
- **Timestamp Accuracy** - Photo capture time matches job completion
- **Proof of Presence** - Visual evidence team was actually on-site

#### How It Works
```
Open Camera → Position Team → Capture Photo → 
Review/Retake → Confirm → Submit with Job
```

### Process Flow
```
Site Work → Camera Capture → Job Submission → 
Database Storage → Huawei Sync → Billing Verification
```

## 🔧 Configuration

### Frontend API Configuration

Edit `/src/app/utils/api.ts`:

```typescript
const API_BASE_URL = "/api"; // Update with your PHP backend URL
```

### Backend Configuration

Edit `config/database.php`:

```php
private $host = "localhost";
private $database_name = "contractor_jobs";
private $username = "your_username";
private $password = "your_password";
```

Edit `config/env.php`:

```php
'huawei_api_url' => getenv('HUAWEI_API_URL'),
'huawei_api_key' => getenv('HUAWEI_API_KEY'),
```

## 📊 Database Schema

### Tables

1. **team_photos** - Reusable team verification photos
2. **job_records** - Completed job records
3. **huawei_sync_log** - Sync attempt history

See [PHP_BACKEND_GUIDE.md](PHP_BACKEND_GUIDE.md) for complete schema.

## 🔐 Security

- ✅ SQL injection prevention (prepared statements)
- ✅ File upload validation (type, size)
- ✅ XSS prevention (React escaping)
- ✅ CORS configuration
- ⚠️ Add authentication for production
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting

## 🧪 Testing

### Current Implementation
- Frontend uses mock data for demonstration
- API calls logged to console
- Ready for PHP backend integration

### Testing with Backend
1. Set up PHP backend following guide
2. Update API_BASE_URL in api.ts
3. Test each workflow:
   - Submit job with new photo
   - Submit job with existing photo
   - View job records
   - Sync to Huawei
   - Manage team photos

## 📱 User Guide

### Submitting a Job
1. Navigate to "Submit Job" tab
2. Fill in job details (number, location, type, date/time)
3. Click "Capture Team Photo" button
4. Allow camera permissions when prompted
5. Position team members in frame
6. Click capture button (circular button at bottom)
7. Review photo - retake if needed, or confirm
8. Add personnel names manually
9. Add job notes (optional)
10. Click "Submit Job Completion"
11. System syncs to Huawei automatically

### Viewing Job Records
1. Navigate to "Job Records" tab
2. Use search to find specific jobs
3. Filter by sync status
4. Click "Sync to Huawei" for pending jobs
5. Export to CSV for reporting

## 🛠️ API Endpoints

### Job Management
- `POST /api/jobs` - Submit job completion (with base64 photo)
- `GET /api/jobs` - Get all job records
- `POST /api/jobs/{id}/sync-huawei` - Sync to Huawei

See [PHP_BACKEND_GUIDE.md](PHP_BACKEND_GUIDE.md) and [CAMERA_IMPLEMENTATION.md](CAMERA_IMPLEMENTATION.md) for detailed endpoint specs.

## 🐛 Troubleshooting

### Camera Issues
- Ensure camera permissions are granted
- Use HTTPS (required for camera access)
- Check if camera is in use by another app
- Try different browser if issues persist
- See [CAMERA_IMPLEMENTATION.md](CAMERA_IMPLEMENTATION.md) for detailed troubleshooting

### Sync Failures
- Verify Huawei API credentials
- Check network connectivity
- Review sync logs for errors
- Use manual retry function

### Database Errors
- Verify database connection settings
- Check table schema is correct
- Ensure proper permissions

## 🚀 Deployment

### Production Checklist
- [ ] Set up production database
- [ ] Configure web server (Apache/Nginx)
- [ ] Set environment variables
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up file upload directory with permissions
- [ ] Configure Huawei API credentials
- [ ] Test all workflows end-to-end
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Implement authentication system

## 📈 Future Enhancements

- [ ] Mobile app (iOS/Android)
- [ ] QR code scanning for site info
- [ ] GPS verification
- [ ] Digital signatures
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline mode with sync
- [ ] Automated reports

## 📞 Support

For issues or questions:
1. Check [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)
2. Review [PHP_BACKEND_GUIDE.md](PHP_BACKEND_GUIDE.md)
3. Check console for API errors
4. Review sync logs in database

## 📄 License

This project is proprietary software for contractor job management.

## 👥 Credits

Built with modern web technologies:
- React + TypeScript
- Tailwind CSS
- PHP + MySQL
- Huawei ISC Integration

---

**Version**: 1.0.0  
**Last Updated**: March 13, 2026

For complete documentation, see [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)