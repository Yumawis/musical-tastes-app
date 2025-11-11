const express = require("express");
const router = express.Router();

const {
  createArtist,
  getAllArtistsId,
  getArtistById,
  updateArtistId,
  deleteArtist,
} = require("../controllers/artistController");

// 👉 Crear artista
router.post("/", createArtist);

// 👉 Obtener todos los artistas
router.get("/", getAllArtistsId);

// 👉 Obtener un solo artista
router.get("/:id", getArtistById);

// 👉 Actualizar artista
router.put("/:id", updateArtistId);

// 👉 Eliminar artista
router.delete("/:id", deleteArtist);

module.exports = router;
