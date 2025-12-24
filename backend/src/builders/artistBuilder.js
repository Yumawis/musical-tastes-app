const buildArtistUpdateData = (newData) => {
  const updateData = {};

  if (newData.name) updateData.name = newData.name;
  if (newData.image) updateData.image = newData.image;

  return updateData;
};

module.exports = { buildArtistUpdateData };
