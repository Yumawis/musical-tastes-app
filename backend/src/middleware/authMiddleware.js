const bcrypt = require("bcrypt");

const { SALT } = require("../constants/auth");

const encriptedPassword = async (password) => {
  try {
    const currentSalt = await bcrypt.genSalt(SALT);
    return await bcrypt.hash(password, currentSalt);
  } catch (error) {
    throw new Error(error);
  }
};

// 🧠 Método para comparar contraseñas al hacer login
const checkPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { encriptedPassword, checkPassword };
