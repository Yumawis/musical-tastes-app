const validateArtistCreate = ({ name, genre }) => {
  if (!name || name.trim() === "") return "La variable name es requerida";

  if (!genre || genre.trim() === "") return "La variable genre es requerida";

  return null;
};

module.exports = { validateArtistCreate };
