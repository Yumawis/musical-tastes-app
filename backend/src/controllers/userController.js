const User = require("../models/User");

// 👉 Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const response = {
      data: {
        message: "Usuarios obtenidos correctamente",
        result: users,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error al obtener los usuarios", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al obtener los usuarios",
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

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        data: {
          message: "Usuario no encontrado",
        },
      });
    }

    console.log("✅ Usuario encontrado:", user);

    const response = {
      data: {
        message: "Usuario obtenido correctamente",
        result: user,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error obteniendo el usuario por ID:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al obtener el usuario",
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
    const newData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, newData, { new: true });

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
        message: "Ocurrió un error al actualizar el usuario",
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

    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({
        data: {
          message: "El usuario no existe o ya fue eliminado",
        },
      });

    await user.deleteOne();

    console.log("🧹 Usuario eliminado correctamente");

    const response = {
      data: {
        message: "Usuario eliminado correctamente",
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error eliminando el usuario:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al eliminar el usuario",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
