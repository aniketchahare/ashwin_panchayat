# Backend API - नगर पंचायत कोरची

Express.js backend server for the Panchayat website.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (see `.env.example`)

3. Create admin user:
```bash
node scripts/createAdmin.js
```

4. Start server:
```bash
npm start
```

## Project Structure

```
backend/
├── models/          # MongoDB models (Admin, Content)
├── routes/          # API routes (auth, content, upload)
├── middleware/      # Authentication middleware
├── utils/           # Utility functions (fileStorage)
├── scripts/         # Utility scripts (createAdmin)
├── public/          # Static files directory
│   └── uploads/     # Uploaded images stored here
├── server.js        # Main server file
└── package.json     # Dependencies
```

## Environment Variables

Required variables in `.env`:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ALLOWED_ORIGINS` - Comma-separated list of allowed frontend origins (optional)
  - Example: `https://your-app.vercel.app,http://localhost:3000`
  - If not set, defaults to localhost and Vercel domains

**Note:** Images are stored in `public/uploads` directory. The directory is created automatically.

## API Documentation

See main README.md for API endpoints.

