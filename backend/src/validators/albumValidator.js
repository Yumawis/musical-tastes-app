const validateAlbumData = ({ artistId, title, releaseDate }) => {
  if (!artistId) return "La variable artistId es requerida para crear un álbum";

  if (!title || title.trim() === "") return "La variable title es requerida";

  if (!releaseDate) return "La variable releaseDate es requerida";

  return null; // ✅ No hay errores
};

module.exports = { validateAlbumData };
