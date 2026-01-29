/**
 * Script to create initial admin user
 * Run: node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panchayat');
    console.log('Connected to MongoDB');

    // Default admin credentials (change these!)
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('Admin already exists with username:', username);
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({ username, password });
    await admin.save();

    console.log('Admin created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('\n⚠️  Please change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

