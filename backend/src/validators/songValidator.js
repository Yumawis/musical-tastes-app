const mongoose = require("mongoose");

const validateSongData = (songData = {}) => {
  const { artistId, title, releaseDate, albumId } = songData;

  if (!artistId || !mongoose.Types.ObjectId.isValid(artistId))
    return "La canción debe tener un artista válido asociado";

  if (!title || title.trim() === "") return "El título de la canción es obligatorio";

  if (!albumId && !releaseDate)
    return "Debes indicar una fecha de lanzamiento si la canción no forma parte de un álbum.";

  if (albumId && !mongoose.Types.ObjectId.isValid(albumId)) return "El ID del álbum no es válido.";

  return null;
};

module.exports = { validateSongData };
