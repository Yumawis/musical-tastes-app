const express = require("express");
const router = express.Router();

const {
  addFavoriteAlbum,
  addFavoriteSong,
  getFavoriteAlbums,
  getFavoriteSongs,
  removeFavoriteAlbum,
  removeFavoriteSong,
} = require("../controllers/favoriteController");

// 👉 Añadir álbum favorito
router.put("/album/:userId", addFavoriteAlbum);

// 👉 Añadir canción favorita
router.put("/song/:userId", addFavoriteSong);

// 👉 Obtener todos los álbumes favoritos por usuario
router.get("/album/:id", getFavoriteAlbums);

// 👉 Obtener todos las canciones favoritas por usuario
router.get("/song/:id", getFavoriteSongs);

// 👉 Eliminar álbum favorito
router.delete("/album/:albumId", removeFavoriteAlbum);

// 👉 Eliminar canción favorita
router.delete("/song/:songId", removeFavoriteSong);

module.exports = router;
