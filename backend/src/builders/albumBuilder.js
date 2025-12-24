const mongoose = require("mongoose");

const buildAlbumUpdateData = (newData) => {
  const updateData = {};

  if (newData.title) updateData.title = newData.title;
  if (newData.releaseDate) updateData.releaseDate = newData.releaseDate;
  if (newData.coverImage) updateData.coverImage = newData.coverImage;

  return updateData;
};

module.exports = { buildAlbumUpdateData };
