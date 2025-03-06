require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
// const taskapi = require("./api/taskapi.js");
const accapi = require("./backend/api/accapi.js");

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// ✅ Validate .env Variables
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.JWT_SECRET) {
    console.error("❌ Missing required environment variables! Check .env file.");
    process.exit(1);
}

// ✅ Sync Database
sequelize.sync({ force: false }) // `force: false` ensures existing data is not lost
    .then(() => console.log("✅ Database & tables synced"))
    .catch(err => console.error("❌ Error syncing database:", err));

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the JWT Authentication API! 🚀");
});

// ✅ Include API Routes
app.use("/accounts", accapi); // Accounts API (Now includes registration & login)
// app.use("/tasks", taskapi); // Tasks API

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// require('dotenv').config();
// const app = require('./app');
// const config = require('./config');
// const logger = require('./utils/logger');

// const PORT = process.env.PORT || 5000;

// // Start the server
// app.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`);
//   logger.info(`Environment: ${process.env.NODE_ENV}`);
// });