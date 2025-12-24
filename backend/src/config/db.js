const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATA_BASE_URL);
    console.log("✅ Conexión a la base de datos realizada correctamente");
    console.log("=======================================================\n");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
  }
};

module.exports = connectDB;
