const mongoose = require("mongoose");
const env = require("./envConfig");
const connect = async () => {
  try {
    const ress = await mongoose.connect(env.URL, {
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully!");
    return { success: true, connection: ress };
  } catch (error) {
    console.error("Database connection error:", error.message);
    // Add more detailed error information for debugging
    if (error.name === 'MongooseTimeoutError' || error.name === 'MongoServerSelectionError') {
      console.error("Failed to connect to MongoDB. Please check your connection string and network.");
    }
    // Exit the process with error code 1
    process.exit(1);
  }
};

module.exports = connect;
