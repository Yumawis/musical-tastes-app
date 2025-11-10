const mongoose = require("mongoose");

const validateSongData = (songData = {}) => {
  const { title, artist, releaseDate, album } = songData;

  if (!artist || !mongoose.Types.ObjectId.isValid(artist))
    return "La canción debe tener un artista válido asociado";

  if (!title || title.trim() === "")
    return "El título de la canción es obligatorio";

  if (!album && !releaseDate)
    return "Debes indicar una fecha de lanzamiento si la canción no forma parte de un álbum.";

  if (album && !mongoose.Types.ObjectId.isValid(album))
    return "El ID del álbum no es válido.";

  return null;
};

module.exports = { validateSongData };
