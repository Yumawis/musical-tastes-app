// 🚀 Configuration server.js
// const { appConfig } = require('./config/app.config.js') // 👈 Import centralized configuration
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const artistRoutes = require("./routes/artistRoutes");
const albumRoutes = require("./routes/albumRoutes");
const songRoutes = require("./routes/songRoutes");
const userRoutes = require("./routes/userRoutes");

// 🏗️ Initialize the Express application
const app = express();

// 🧩 Global Middlewares
app.use(
  cors({
    // origin: appConfig.allowedCORS, // 👈 Allowed domains from app.config.json
    origin: process.env.ALLOWED_CORS, // 👈 Allowed domains from app.config.json
    credentials: true, // 👈 Allows sending of cookies or personalized headers
  })
);

app.use(express.json()); // 📦 Allows receiving JSON in requests

connectDB();

const prefix = "/api/v1/musical-tastes";

// 🛣️ Main Routes
app.use(`${prefix}/artist`, artistRoutes);
app.use(`${prefix}/album`, albumRoutes);
app.use(`${prefix}/song`, songRoutes);
app.use(`${prefix}/user`, userRoutes);

// ⚙️ Start the server
app.listen(process.env.PORT, () => {
  console.log("=======================================================");
  console.log("🟢 Servidor iniciado correctamente");
  console.log(`🌐 URL base: http://localhost:${process.env.PORT}`);
  console.log("⚙️ Configuración:");
  console.log(`     - CORS permitido: ${process.env.ALLOWED_CORS}`);
});
