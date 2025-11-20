const FavoriteAlbum = require("../models/FavoriteAlbum");
const FavoriteSong = require("../models/FavoriteSong");

const { validateFavoriteAlbum } = require("../validators/albumValidator");
const { validateFavoriteSong } = require("../validators/songValidator");

// 👉 Agregar álbum favorito
const addFavoriteAlbum = async (req, res) => {
  try {
    const { userId, albumId } = req.body;

    const validationError = validateFavoriteAlbum({ userId, albumId });

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    const favoriteAlbum = await FavoriteAlbum.findOneAndUpdate(
      { userId },
      {
        $addToSet: { albums: albumId },
        $setOnInsert: { userId },
      },
      { new: true, upsert: true }
    );

    console.log("✅ Albúm agregado:", favoriteAlbum);

    const response = {
      data: {
        message: "Álbum favorito agregado",
        result: favoriteAlbum,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    const response = {
      data: {
        message: "Ocurrió un error agregando el álbum a favoritos",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Agregar canción favorita
const addFavoriteSong = async (req, res) => {
  try {
    const { userId, songId } = req.body;

    const validationError = validateFavoriteSong({ userId, songId });

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    const favoriteSong = await FavoriteSong.findOneAndUpdate(
      { userId },
      {
        $addToSet: { songs: songId },
        $setOnInsert: { userId },
      },
      { new: true, upsert: true }
    );

    console.log("✅ Canción agregada:", favoriteSong);

    const response = {
      data: {
        message: "Canción favorita agregada",
        result: favoriteSong,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    const response = {
      data: {
        message: "Ocurrió un error agregando la canción a favoritos",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Remover album favorito
const removeFavoriteAlbum = async (req, res) => {
  try {
    const { userId, albumId } = req.body;

    const validationError = validateFavoriteAlbum({ userId, albumId });

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    const updatedfavoriteAlbum = await FavoriteAlbum.findOneAndUpdate(
      { userId },
      { $pull: { albums: albumId } },
      { new: true }
    );

    if (!updatedfavoriteAlbum) {
      return res.status(404).json({
        data: { message: "El usuario no tiene álbumes favoritos registrados" },
      });
    }

    console.log("✅ Albúm removido de la lista:", updatedfavoriteAlbum);

    const response = {
      data: {
        message: "Albúm removido de la lista de favoritos",
        result: updatedfavoriteAlbum,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    const response = {
      data: {
        message: "Ocurrió un error removiendo el álbum de favoritos",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Remover canción favorita
const removeFavoriteSong = async (req, res) => {
  try {
    const { userId, songId } = req.body;

    const validationError = validateFavoriteSong({ userId, songId });

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    const updatedfavoriteSong = await FavoriteSong.findOneAndUpdate(
      { userId },
      { $pull: { songs: songId } },
      { new: true }
    );

    if (!updatedfavoriteSong) {
      return res.status(404).json({
        data: { message: "El usuario no tiene canciones favoritas registradas" },
      });
    }

    console.log("✅ Canción removida de la lista:", updatedfavoriteSong);

    const response = {
      data: {
        message: "Canción removida de la lista de favoritos",
        result: updatedfavoriteSong,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    const response = {
      data: {
        message: "Ocurrió un error removiendo la canción de favoritos",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

module.exports = {
  addFavoriteAlbum,
  addFavoriteSong,
  removeFavoriteAlbum,
  removeFavoriteSong,
};
