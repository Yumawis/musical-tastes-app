const mongoose = require("mongoose");

const { normalizeId } = require("../utilities/normalize");

const validateSong = (data) => {
  let { artistId, albumId, title, releaseDate, duration, type } = data;

  artistId = normalizeId(artistId);
  albumId = normalizeId(albumId);

  const hasArtist = !!artistId;
  const hasAlbum = !!albumId;

  // 🚫 Caso inválido: llegan los dos
  if (hasArtist && hasAlbum) {
    return "No puedes enviar artistId y albumId al mismo tiempo. Solo uno es permitido.";
  }

  // 🟩 1. Crear canción individual
  if (hasArtist) {
    if (!artistId || !mongoose.Types.ObjectId.isValid(artistId))
      return "El artistId es inválido o no fue enviado";

    if (!title || title.trim() === "") return "El título es obligatorio";

    if (!releaseDate) return "La fecha de lanzamiento es obligatoria para una canción individual";

    if (!duration) return "La duración es obligatoria";

    if (!type || type.trim() === "") return "El tipo de canción es obligatorio";

    return null; // válido
  }

  // 🟩 2. Crear canción dentro de un álbum
  if (hasAlbum) {
    if (!albumId || !mongoose.Types.ObjectId.isValid(albumId))
      return "El albumId es inválido o no fue enviado";

    if (!title || title.trim() === "") return "El título es obligatorio";

    if (!duration) return "La duración es obligatoria";

    if (!type || type.trim() === "") return "El tipo de canción es obligatorio";

    if (releaseDate) return "No puedes enviar releaseDate cuando la canción pertenece a un álbum";

    return null; // válido
  }

  // 🚫 Caso inválido: no trae ni artistId ni albumId
  return "Debes enviar artistId para canción individual o albumId para canción de álbum";
};

const validateFavoriteSong = ({ userId, songId }) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId))
    return "La variable userId es requerida para remover una canción de favoritos";

  if (!songId || !mongoose.Types.ObjectId.isValid(songId)) return "La variable songId es requerida";
};

module.exports = { validateSong, validateFavoriteSong };
