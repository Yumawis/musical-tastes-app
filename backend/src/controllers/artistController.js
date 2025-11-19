const Artist = require("../models/Artist");

const { validateArtistData } = require("../validators/artistValidator");

// 👉 Crear artista
const createArtist = async (req, res) => {
  try {
    // 🔹 Validar datos
    const validationError = validateArtistData(req.body);

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    console.log("🎨 Creando nuevo artista...");

    const { name, genre, image, albums, songs } = req.body;

    // 💾 Crear artista
    const newArtist = new Artist({ name, genre, image, albums, songs });
    const savedArtist = await newArtist.save();

    console.log("✅ Artista creado:", savedArtist);

    const response = {
      data: {
        message: "Artista creado exitosamente",
        artistId: savedArtist._id,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error al crear el artista:", errorMessage);

    if (error.code === 11000) {
      return res.status(422).json({ data: { message: "Ya existe un artista con ese nombre" } });
    }

    const response = {
      data: {
        message: "Ocurrió un error al crear el artista",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener todos los artistas
const getAllArtists = async (req, res) => {
  try {
    console.log("📋 Obteniendo lista de artistas...");

    const artists = await Artist.find();

    console.log("✅ Artistas encontrados:", artists.length);

    const response = {
      data: {
        message: "Artistas encontrados exitosamente",
        result: artists,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error obteniendo todos los artistas:", errorMessage);

    const response = {
      data: {
        message: "Error al obtener los artistas",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener artista por ID
const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Buscando artista con ID: ${id}`);

    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(400).json({
        data: { message: "Artista no encontrado" },
      });
    }

    console.log("✅ Artista encontrado:", artist);

    const response = {
      data: {
        message: "Artista encontrado correctamente",
        result: artist,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error obteniendo el artista por ID:", errorMessage);

    const response = {
      data: {
        message: "Error al obtener el artista",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Actualizar artista
const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;

    const newData = req.body;
    const { name } = newData;

    console.log(`✏️ Actualizando artista con ID: ${id}`);

    // 🔹 Verificar duplicado (si el nombre cambia)
    const existingArtist = await Artist.findOne({ name });

    if (existingArtist && existingArtist._id !== id) {
      return res.status(422).json({
        data: {
          message: "Ya existe otro artista con ese nombre",
        },
      });
    }

    // 🔹 Actualizar datos
    const updatedArtist = await Artist.findByIdAndUpdate(id, newData, { new: true });

    console.log("✅ Artista actualizado:", updatedArtist);

    const response = {
      data: {
        message: "Artista actualizado correctamente",
        result: updatedArtist,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error actualizando el artista:", errorMessage);

    const response = {
      data: {
        message: "Error al actualizar el artista",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Eliminar artista
const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;

    // 🟢 Buscar el artista primero
    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({
        data: {
          message: "El artista no existe o ya fue eliminado",
        },
      });
    }

    // 🗑️ Eliminar el artista (esto activará el middleware pre("deleteOne"))
    await artist.deleteOne();

    console.log("✅ Artista eliminado correctamente:");

    // ✅ Respuesta al cliente
    const response = {
      data: {
        message: "Artista eliminado correctamente junto con sus álbumes relacionados",
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error eliminando el artista:", errorMessage);

    const response = {
      data: {
        message: "Error al eliminar el artista",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

module.exports = {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
};
