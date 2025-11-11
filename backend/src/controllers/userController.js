const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    console.log("Creando nuevo usuario...");

    const newUser = new User(req.body);
    const result = await newUser.save();

    const response = {
      data: {
        message: "Usuario creado correctamente",
        userId: result._id,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error al crear el usuario", errorMessage);

    const response = {
      data: {
        message: "Error al crear el usuario",
        error: errorMessage,
      },
    };

    return res.status(400).json(response);
  }
};
