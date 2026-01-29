# Quick Setup Guide

Follow these steps to get the application running:

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/panchayat
JWT_SECRET=change_this_to_a_random_secret_key
```
Images will be stored in `backend/public/uploads` directory automatically.

Create admin user:
```bash
node scripts/createAdmin.js admin admin123
```

Start backend:
```bash
npm start
```

## Step 2: Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```bash
# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

Or manually create `.env` file with:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

## Step 3: Access the Application

- **Public Website:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`

## Image Storage

Images are automatically stored in the `backend/public/uploads` directory. The directory will be created automatically when you start the server.

- Images are served directly from the backend at `/uploads/filename.jpg`
- No external storage service required
- Files are stored locally on the server

## MongoDB Setup

### Option 1: Local MongoDB
Install MongoDB locally and use:
```
MONGODB_URI=mongodb://localhost:27017/panchayat
```

### Option 2: MongoDB Atlas (Free Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` with your connection string

## Troubleshooting

### Backend won't start
- Check MongoDB is running (if using local)
- Verify `.env` file exists and has all required variables
- Check port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- **Create `.env` file in frontend directory** with:
  ```
  REACT_APP_API_URL=http://localhost:5000/api
  ```
- Restart frontend after creating `.env` file
- Check browser console for CORS errors
- Verify API calls in browser Network tab

### Upload fails
- Check file size (max 10MB per file)
- Ensure files are images only (JPEG, PNG, GIF, WebP, etc.)
- Verify `backend/public/uploads` directory exists and is writable
- Check backend server has write permissions
- Ensure backend server is running

## Next Steps

1. Change default admin password after first login
2. Add your first event/achievement/work item
3. Customize the website as needed

