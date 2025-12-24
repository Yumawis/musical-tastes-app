const buildUserUpdateData = (newData) => {
  const updateData = {};

  if (newData.names) updateData.names = newData.names;
  if (newData.lastNames) updateData.lastNames = newData.lastNames;
  if (newData.email) updateData.email = newData.email;

  return updateData;
};

module.exports = { buildUserUpdateData };
