# नगर पंचायत कोरची - Website

A full-stack web application for local government body website management.

**Website Name:** नगर पंचायत कोरची  
**Tagline:** स्वच्छ कोरची, सुंदर कोरची

## Project Structure

```
panchayat/
├── backend/          # Node.js + Express + MongoDB backend
└── frontend/         # React.js frontend
```

## Features

### Public Website
- Display Events, Achievements, and Work Done
- View image galleries
- Clean, responsive government-style UI
- No authentication required

### Admin Panel
- Secure login system (JWT-based)
- Manage Events, Achievements, and Work Done
- Upload multiple images per item
- Create, Edit, and Delete content
- Protected routes

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Local File Storage (Images stored in backend/public/uploads)

**Frontend:**
- React.js
- React Router
- Axios
- CSS3

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/panchayat
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

5. Create initial admin user:
```bash
node scripts/createAdmin.js [username] [password]
```
Default: `admin` / `admin123` (change these!)

6. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. **Create `.env` file** (required):
   - Create a file named `.env` in the `frontend` directory
   - Add: `REACT_APP_API_URL=http://localhost:5000/api`
   - See `frontend/CREATE_ENV.md` for detailed instructions

4. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token (protected)

### Content (Public)
- `GET /api/content` - Get all content (optional: `?type=EVENT`)
- `GET /api/content/:id` - Get single content item

### Content (Protected - Admin Only)
- `POST /api/content` - Create new content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Upload (Protected - Admin Only)
- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

## Content Types

- `EVENT` - Upcoming Events
- `ACHIEVEMENT` - Achievements
- `WORK` - Work Done

## Default Admin Credentials

After running the createAdmin script:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the default password after first login!

## Production Deployment

### Backend
1. Set proper environment variables
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set a strong JWT_SECRET
4. Use process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name panchayat-backend
```

### Frontend
1. Build the production bundle:
```bash
npm run build
```
2. Serve the `build` folder using a web server (nginx, Apache, etc.)
3. Update API URL in production environment

## Security Notes

- Never commit `.env` files
- Use strong JWT_SECRET in production
- Change default admin credentials
- Use HTTPS in production
- Implement rate limiting for production
- Regularly update dependencies

## License

ISC

