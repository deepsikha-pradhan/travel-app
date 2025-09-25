const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let cachedDb = null;

const uri = process.env.MONGO_URI;
const dbName = process.env.DATABASE_NAME;

const connectToDatabase = async () => {
  if (cachedDb) {
    console.log("Using existing MongoDB connection");
    return cachedDb;
  }
  try {
    await mongoose.connect(uri, {
      dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    cachedDb = mongoose.connection;
    return cachedDb;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

const closeDatabaseConnection = () => {
  if (cachedDb) {
    mongoose.connection.close();
    console.log("Closed MongoDB connection");
    cachedDb = null;
  }
};

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
};
