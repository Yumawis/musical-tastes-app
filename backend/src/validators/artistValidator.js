const validateArtistData = ({ name }) => {
  if (!name || name.trim() === "") return "La variable name es requerida";

  return null;
};

module.exports = { validateArtistData };
