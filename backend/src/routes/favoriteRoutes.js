const express = require("express");
const router = express.Router();

const {
  addFavoriteAlbum,
  addFavoriteSong,
  getAllFavorites,
  getSongFavorite,
  getAlbumFavorite,
  removeFavoriteAlbum,
  removeFavoriteSong,
} = require("../controllers/favoriteController");

// 👉 Añadir álbum favorito
router.put("/album/:userId", addFavoriteAlbum);

// 👉 Añadir canción favorita
router.put("/song/:id", addFavoriteSong);

// 👉 Obtener todos los favoritos por usuario
router.get("/:id", getAllFavorites);

// 👉 Obtener todos los álbumes favoritos por usuario
router.get("/album/:id", getAlbumFavorite);

// 👉 Obtener todos las canciones favoritas por usuario
router.get("/song/:id", getSongFavorite);

// 👉 Eliminar álbum favorito
router.delete("/album/:albumId", removeFavoriteAlbum);

// 👉 Eliminar canción favorita
router.delete("/song/:songId", removeFavoriteSong);

module.exports = router;
