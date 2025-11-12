const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  rol: { type: String, enum: ["ADMIN", "CLIENT"], default: "CLIENT" },
  names: { type: String, trim: true, required: true },
  lastnames: { type: String, trim: true, required: true },
  email: { type: String, trim: true, unique: true, required: true },
  password: { type: String, trim: true, required: true },
});

// 🔐 Middleware: cifrar contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Solo si fue cambiada

  try {
    const salt = await bcrypt.genSalt(5);
    this.password = await bcrypt.hash(this.password, salt);

    next(); // continúa el flujo normal
  } catch (error) {
    next(error);
  }
});

// 🧠 Método para comparar contraseñas
userSchema.methods.checkPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
