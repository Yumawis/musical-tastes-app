const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// 👉 Crear usuario
router.post("/register", createUser);

// 👉 Iniciar sesión
router.post("/login", loginUser);

// 👉 Obtener todos los usuarios
router.get("/", getAllUsers);

// 👉 Obtener un solo usuario
router.get("/:id", getUserById);

// 👉 Actualizar usuario
router.put("/:id", updateUser);

// 👉 Eliminar usuario
router.delete("/:id", deleteUser);

module.exports = router;
