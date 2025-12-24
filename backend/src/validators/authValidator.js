const { VALIDATE_EMAIL } = require("../constants/regex");

const validateSignUp = ({ names, lastNames, email, password }) => {
  if (!names || names.trim() === "") return "La variable name es requerida";

  if (!lastNames || lastNames.trim() === "") return "La variable lastNames es requerida";

  if (!email) return "La variable email es requerida";

  if (!VALIDATE_EMAIL.test(email)) return "Formato de email inválido";

  if (!password) return "La variable password es requerida";

  if (password.length < 6) return "La variable password debe tener al menos 6 caracteres";
};

const validateNewPassword = ({ currentPassword, newPassword }) => {
  if (!currentPassword) return "La variable currentPassword es requerida";

  if (!newPassword) return "La variable newPassword es requerida";

  if (newPassword.length < 6) return "La variable password debe tener al menos 6 caracteres";
};
module.exports = { validateSignUp, validateNewPassword };
