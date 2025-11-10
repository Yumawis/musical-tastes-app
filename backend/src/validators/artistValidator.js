const validateArtistData = ({ name, genre }) => {
  if (!name || name.trim() === "") return "El nombre del artista es requerido";

  if (!genre || genre.trim() === "")
    return "El género del artista es requerido";

  return null;
};

module.exports = { validateArtistData };
