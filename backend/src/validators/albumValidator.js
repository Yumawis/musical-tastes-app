const mongoose = require("mongoose");

const validateAlbum = ({ artistId, title, releaseDate, type }) => {
  if (!artistId || !mongoose.Types.ObjectId.isValid(artistId))
    return "La variable artistId es requerida para crear un álbum";

  if (!title || title.trim() === "") return "La variable title es requerida";

  if (!releaseDate) return "La variable releaseDate es requerida";

  if (!type || type.trim() === "") return "La variable type es requerida";

  return null; // ✅ No hay errores
};

const validateFavoriteAlbum = ({ userId, albumId }) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId))
    return "La variable userId es requerida para remover un álbum de favoritos";

  if (!albumId || !mongoose.Types.ObjectId.isValid(albumId))
    return "La variable albumId es requerida";
};

module.exports = { validateAlbum, validateFavoriteAlbum };
