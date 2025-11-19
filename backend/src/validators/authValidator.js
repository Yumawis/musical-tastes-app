const { VALIDATE_EMAIL } = require("../constants/regex");

const validateSignUp = ({ names, lastNames, email, password }) => {
  if (!names || names.trim() === "") return "La variable name es requerida";

  if (!lastNames || lastNames.trim() === "") return "La variable lastNames es requerida";

  if (!email) return "La variable email es requerida";

  if (!VALIDATE_EMAIL.test(email)) return "Formato de email inválido";

  if (!password) return "La contraseña es obligatoria";

  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
};

module.exports = { validateSignUp };
