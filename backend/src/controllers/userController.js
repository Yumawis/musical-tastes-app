const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { names, lastnames, email, rol } = req.body;

    console.log("Creando nuevo usuario...");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        data: {
          message: "El email ya está registrado",
        },
      });
    }

    const user = new User({
      names,
      lastnames,
      email,
      rol: rol || "CLIENT",
    });

    await user.save();

    const response = {
      data: {
        message: "Usuario creado exitosamente",
        result: user._id,
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

    return res.status(422).json(response);
  }
};

// 👉 Iniciar sesión básico
const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Iniciando sesión de usario...");

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        data: {
          message: "Usuario no encontrado",
        },
      });
    }

    const response = {
      data: {
        message: "Inicio de sesión exitoso",
        result: user,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error iniciando sesión", errorMessage);

    const response = {
      data: {
        message: "Error al iniciar sesión",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    console.log("Obteniendo todos los usuarios...");

    const response = {
      data: {
        message: "Usuarios obtenidos exitosamente",
        result: users,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error al obtener los usuarios", errorMessage);

    const response = {
      data: {
        message: "Error obteniendo todos los usuarios",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Buscando usuarios con ID: ${id}`);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        data: {
          message: "Usuario no encontrado",
        },
      });
    }

    const response = {
      data: {
        message: "Usuario encontrado correctamente",
        result: user,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error obteniendo el usuario por ID:", errorMessage);

    const response = {
      data: {
        message: "Error al obtener el usuario",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { names, lastnames, email, rol } = req.body;

    console.log(`✏️ Actualizando usuario con ID: ${id}`);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { names, lastnames, email, rol },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({
        data: {
          message: "Usuario no encontrado",
        },
      });

    const response = {
      data: {
        message: "Usuario actualizado correctamente",
        result: updatedUser,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error actualizando el usuario:", errorMessage);

    const response = {
      data: {
        message: "Error al actualizar el usuario",
        error: error.message,
      },
    };

    res.status(422).json(response);
  }
};

// 👉 Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`✏️ Eliminando usuario con ID: ${id}`);

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser)
      return res.status(404).json({
        data: {
          message: "El usuario no existe o ya fue eliminado",
        },
      });

    const response = {
      data: {
        message: "Usuario eliminado exitosamente",
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error eliminando el usuario:", errorMessage);

    const response = {
      data: {
        message: "Error al eliminar el usuario",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
