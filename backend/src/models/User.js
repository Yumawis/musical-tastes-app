const mongoose = require("mongoose");

const FavoriteSong = require("../models/FavoriteSong");
const FavoriteAlbum = require("../models/FavoriteAlbum");

const { encriptedPassword } = require("../middleware/authMiddleware");

const ROLES = require("../constants/roles");

const userSchema = new mongoose.Schema(
  {
    rol: { type: String, enum: [ROLES.ADMIN, ROLES.CLIENT], default: ROLES.CLIENT },
    names: { type: String, trim: true, required: true },
    lastNames: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, trim: true, minLength: 6, required: true },
  },
  { timestamps: true }
);

// 🔐 Middleware: cifrar contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Solo si fue cambiada

  try {
    this.password = await encriptedPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware para eliminar listas de favoritos al eliminar un usuario
userSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    const userId = this._id;

    await FavoriteSong.deleteOne({ userId });
    await FavoriteAlbum.deleteOne({ userId });

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
