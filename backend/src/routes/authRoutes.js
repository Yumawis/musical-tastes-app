const express = require("express");
const router = express.Router();

const { signUp, login } = require("../controllers/authController");

// 👉 Crear usuario
router.post("/sign-up", signUp);

// 👉 Iniciar sesión
router.post("/login", login);

module.exports = router;
