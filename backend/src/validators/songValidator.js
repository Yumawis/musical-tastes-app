const mongoose = require("mongoose");

const validateSong = ({ artistId, title, releaseDate, albumId, type }) => {
  if (!artistId || !mongoose.Types.ObjectId.isValid(artistId))
    return "La variable artistId es requerida para crear una canción";

  if (!title || title.trim() === "") return "La variable title es obligatoria";

  if (!albumId && !releaseDate)
    return "La variable releaseDate es obligatoria si la canción no pertenece a ningún álbum";

  if (!type || type.trim() === "") return "La variable type es requerida";

  return null;
};

const validateFavoriteSong = ({ userId, songId }) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return "La variable userId es requerida";

  if (!songId || !mongoose.Types.ObjectId.isValid(songId)) return "La variable songId es requerida";
};

module.exports = { validateSong, validateFavoriteSong };
