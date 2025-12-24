const buildSongUpdateData = (currentSong, newData) => {
  const updateData = {};

  const isSingle = !currentSong.albumId; // true si NO pertenece a un álbum

  // --- Siempre se puede actualizar el título ---
  if (newData.title) updateData.title = newData.title;

  // --- Siempre se puede actualizar la duración ---
  if (newData.duration) updateData.duration = newData.duration;

  // --- Si es sencillo: puede actualizar estos campos ---
  if (isSingle) {
    if (newData.releaseDate) updateData.releaseDate = newData.releaseDate;
    if (newData.coverImage) updateData.coverImage = newData.coverImage;
  }

  return updateData;
};

module.exports = { buildSongUpdateData };
