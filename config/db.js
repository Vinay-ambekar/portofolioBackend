const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = `mongodb://${process.env.MONGODB_USER}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOSTS}/${process.env.MONGODB_DB_NAME}?${process.env.MONGODB_OPTIONS}`;
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected - DB: ${conn.connection.db.databaseName}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
