require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  const email = process.env.ADMIN_EMAIL || 'admin@icecream.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    // Update role to admin just in case
    existing.role = 'admin';
    existing.isActive = true;
    await existing.save({ validateBeforeSave: false });
    console.log('Role confirmed as admin.');
  } else {
    await User.create({
      name: 'Admin',
      email,
      password,
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    });
    console.log(`Admin user created: ${email} / ${password}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
