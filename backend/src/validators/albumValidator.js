const validateAlbumData = ({ artistId, title }) => {
  if (!artistId) return "El álbum debe tener un artista asociado";

  if (!title || title.trim() === "") return "El título del álbum es requerido";

  return null; // ✅ No hay errores
};

module.exports = { validateAlbumData };
