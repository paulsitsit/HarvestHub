import 'dotenv/config';
import connectDB from '../src/config/db.js';
import User from '../src/models/User.js';
import { ROLES } from '../src/config/constants.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME || 'HarvestHub Administrator';
    const email = (
      process.env.ADMIN_EMAIL || 'admin@harvesthub.local'
    ).toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

    const existingAdmin = await User.findOne({
      email
    }).select('+password');

    if (existingAdmin) {
      if (existingAdmin.role !== ROLES.ADMIN) {
        existingAdmin.role = ROLES.ADMIN;
        await existingAdmin.save();
      }

      console.log(`Admin account already exists: ${email}`);
      process.exit(0);
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: ROLES.ADMIN,
      isActive: true
    });

    console.log(`Admin created: ${admin.email}`);
    console.log('Use the ADMIN_PASSWORD value from your .env file.');
    process.exit(0);
  } catch (error) {
    console.error(`Admin seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();