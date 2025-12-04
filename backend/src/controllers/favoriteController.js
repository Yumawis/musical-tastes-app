const Album = require("../models/Album");
const Song = require("../models/Song");
const User = require("../models/User");

const FavoriteAlbum = require("../models/FavoriteAlbum");
const FavoriteSong = require("../models/FavoriteSong");

const { validateFavoriteAlbum } = require("../validators/albumValidator");
const { validateFavoriteSong } = require("../validators/songValidator");

// 👉 Agregar álbum favorito
const addFavoriteAlbum = async (req, res) => {
  try {
    const { userId } = req.params;
    const { albumId } = req.body;

    const validationError = validateFavoriteAlbum({ userId, albumId });

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        data: { message: "Usuario no encontrado" },
      });
    }

    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(400).json({
        data: { message: "Álbum no encontrado" },
      });
    }

    const favorite = await FavoriteAlbum.findOne({ userId });

    if (favorite && favorite.albums.includes(albumId)) {
      return res.status(400).json({
        data: { message: "Este álbum ya se encuentra en la lista de favoritos" },
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
    const { userId } = req.params;
    const { songId } = req.body;

    const validationError = validateFavoriteSong({ userId, songId });

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        data: { message: "Usuario no encontrado" },
      });
    }

    const song = await Song.findById(songId);

    if (!song) {
      return res.status(400).json({
        data: { message: "Canción no encontrada" },
      });
    }

    const favorite = await FavoriteSong.findOne({ userId });

    if (favorite && favorite.songs.includes(songId)) {
      return res.status(400).json({
        data: { message: "Esta canción ya se encuentra en la lista de favoritos" },
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

// 👉 Obtener todos los favoritos por usuario
const getAllFavorites = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        data: { message: "Usuario no encontrado" },
      });
    }

    const favoriteAlbums = await FavoriteAlbum.findOne({ userId: id }).populate({
      path: "albums",
      select: "_id title image",
      populate: {
        path: "tracklist",
        model: "Song",
        select: "_id title",
      },
    });

    const favoriteSongs = await FavoriteSong.findOne({ userId: id });

    const response = {
      data: {
        message: "Lista de favoritos obtenidos correctamente",
        result: { favoriteAlbums, favoriteSongs },
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error obteniendo la lista de favoritos:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al obtener la lista de favoritos",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener los álbumes favoritos
const getAlbumFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        data: { message: "Usuario no encontrado" },
      });
    }

    const albums = await FavoriteAlbum.find({ userId: id }).populate({
      path: "albums",
      select: "_id title image",
      populate: {
        path: "tracklist",
        model: "Song",
        select: "_id title",
      },
    });

    console.log("✅ Lista de álbumes favoritos encontrados:", albums.length);

    console.log("🎵 Cantidad de álbumes favoritos:", albums[0]?.albums.length || 0);

    const response = {
      data: {
        message: "Lista de álbumes favoritos obtenidos correctamente",
        result: albums,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error obteniendo la lista de álbumes favoritos:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al obtener la lista de álbumes favoritos",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener las canciones favoritas
const getSongFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        data: { message: "Usuario no encontrado" },
      });
    }

    const songs = await FavoriteSong.find({ userId: id });

    console.log("✅ Lista de canciones favoritas encontradas:", songs.length);

    console.log("🎵 Cantidad de canciones favoritas:", songs[0]?.songs.length || 0);

    const response = {
      data: {
        message: "Lista de canciones favoritas obtenidas correctamente",
        result: songs,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error obteniendo la lista de canciones favoritas:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al obtener la lista de canciones favoritas",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Remover album favorito
const removeFavoriteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { userId } = req.body;

    const validationError = validateFavoriteAlbum({ albumId });

    if (validationError) {
      return res.status(400).json({
        data: { message: validationError },
      });
    }

    const favorite = await FavoriteAlbum.findOne({ userId });

    if (!favorite) {
      return res.status(400).json({
        data: { message: "El usuario no tiene álbumes favoritos registrados" },
      });
    }

    const exists = favorite.albums.includes(albumId);

    if (!exists) {
      return res.status(400).json({
        data: { message: "El álbum no está en la lista de favoritos del usuario" },
      });
    }

    const updatedFavoriteAlbum = await FavoriteAlbum.findOneAndUpdate(
      { userId },
      { $pull: { albums: albumId } },
      { new: true }
    );

    // Si la lista queda vacía, borrar el documento completo
    if (updatedFavoriteAlbum.albums.length === 0) {
      await FavoriteAlbum.deleteOne({ userId });
      console.log("🗑 Documento eliminado porque ya no tenía álbumes favoritos");

      return res.status(200).json({
        data: {
          message: "Álbum removido y lista de favoritos vacía eliminada del usuario",
          result: [],
        },
      });
    }

    // Si aún quedan álbumes favoritos
    console.log("✅ Albúm removido de la lista:", updatedFavoriteAlbum);

    const response = {
      data: {
        message: "Albúm removido de la lista de favoritos",
        result: updatedFavoriteAlbum,
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

    const favorite = await FavoriteSong.findOne({ userId });

    if (!favorite) {
      return res.status(400).json({
        data: { message: "El usuario no tiene canciones favoritas registradas" },
      });
    }

    const exists = favorite.songs.includes(songId);

    if (!exists) {
      return res.status(400).json({
        data: { message: "La canción no está en la lista de favoritos del usuario" },
      });
    }

    const updatedfavoriteSong = await FavoriteSong.findOneAndUpdate(
      { userId },
      { $pull: { songs: songId } },
      { new: true }
    );

    if (updatedfavoriteSong.songs.length === 0) {
      await FavoriteSong.deleteOne({ userId });
      console.log("🗑 Documento eliminado porque ya no tenía canciones favoritas");

      return res.status(200).json({
        data: {
          message: "Canción removida y lista de favoritos vacía eliminada del usuario",
          result: [],
        },
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
  getAllFavorites,
  getAlbumFavorite,
  getSongFavorite,
  removeFavoriteAlbum,
  removeFavoriteSong,
};
