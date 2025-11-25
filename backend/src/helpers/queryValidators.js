const User = require("../models/User");

const existingEmail = async (email) => {
  const existingUser = await User.findOne({ email });

  if (!!existingUser) {
    return res.status(400).json({
      data: {
        message: "El email ya está registrado",
      },
    });
  }

  return;
};

module.exports = { existingEmail };
