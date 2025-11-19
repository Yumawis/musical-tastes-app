const mongoose = require("mongoose");

const validateSongData = (data) => {
  const { artistId, title, releaseDate, albumId } = data;

  if (!artistId || !mongoose.Types.ObjectId.isValid(artistId))
    return "La variable artistId es requerida para crear una canción";

  if (!title || title.trim() === "") return "La variable title es obligatoria";

  if (!albumId && !releaseDate)
    return "La variable releaseDate es obligatoria si la canción no pertenece a ningún álbum";

  return null;
};

module.exports = { validateSongData };
