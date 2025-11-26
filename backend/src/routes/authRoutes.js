const express = require("express");
const router = express.Router();

const { signUp, login, changePassword } = require("../controllers/authController");

// 👉 Crear usuario
router.post("/sign-up", signUp);

// 👉 Iniciar sesión
router.post("/login", login);

// 👉 Actualizar contraseña
router.put("/change-password/:id", changePassword);

module.exports = router;
