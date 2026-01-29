# Frontend - नगर पंचायत कोरची

React.js frontend application for the Panchayat website.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/
│   │   ├── Public/      # Public website components
│   │   └── Admin/       # Admin panel components
│   ├── config/          # API configuration
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
└── package.json
```

## Environment Variables

Optional `.env` file:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Routes

- `/` - Public home page
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard (protected)

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

