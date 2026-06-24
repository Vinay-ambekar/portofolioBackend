const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');

const seedUser = async () => {
  try {
    await connectDB();

    const userExists = await User.findOne({ email: 'vinayambekar.b@gmail.com' });
    if (!userExists) {
      await User.create({ email: 'vinayambekar.b@gmail.com', password: 'Vinay@12345' });
      console.log('Default user created (vinayambekar.b@gmail.com)');
    } else {
      console.log('Default user already exists, skipping');
    }

    console.log('Seed completed');
  } catch (error) {
    console.error('Seed error:', error.message);
    throw error;
  }
};

if (require.main === module) {
  seedUser().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seedUser;
