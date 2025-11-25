const User = require("../models/User");

const { validateSignUp } = require("../validators/authValidator");
const { existingEmail } = require("../helpers/queryValidators");

// 👉 Registrar usuario
const signUp = async (req, res) => {
  try {
    const { names, lastNames, email, password, rol } = req.body;

    const validationError = validateSignUp(req.body);

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    await existingEmail(email);

    const newUser = new User({
      names,
      lastNames,
      email,
      password,
      rol,
    });

    const savedUser = await newUser.save();
    const currentUser = { id: savedUser._id };

    console.log("✅ Usuario creado correctamente:", currentUser);

    const response = {
      data: {
        message: "Usuario registrado correctamente",
        result: currentUser,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error al registrar el usuario", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al registrar el usuario",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Iniciar sesión básico
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Buscar al usuario por su email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        data: {
          message: "Usuario no encontrado",
        },
      });
    }

    console.log("user:", user, password);
    // 2️⃣ Verificar la contraseña usando bcrypt
    const isMatch = await user.checkPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        data: {
          message: "Contraseña incorrecta",
        },
      });
    }

    // 3️⃣ Si es correcta, devuelves info del usuario
    const response = {
      data: {
        message: "Inicio de sesión exitoso",
        result: {
          id: user._id,
          names: user.names,
          email: user.email,
          rol: user.rol,
        },
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error iniciando sesión", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al iniciar sesión",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

//change password

module.exports = {
  signUp,
  login,
};
