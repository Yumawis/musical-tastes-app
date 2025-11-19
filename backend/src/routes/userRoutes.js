const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// 👉 Obtener todos los usuarios
router.get("/", getAllUsers);

// 👉 Obtener un solo usuario
router.get("/:id", getUserById);

// 👉 Actualizar usuario
router.put("/:id", updateUser);

// 👉 Eliminar usuario
router.delete("/:id", deleteUser);

module.exports = router;
