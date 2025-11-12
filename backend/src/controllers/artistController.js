const Artist = require("../models/Artist");
const { validateArtistData } = require("../validators/artistValidator");

// 👉 Crear artista
const createArtist = async (req, res) => {
  try {
    const { name, image, albumId } = req.body;

    console.log("🎨 Creando nuevo artista...");

    // 🔹 Validar datos
    const validationError = validateArtistData(req.body);

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    // 🔍 Verificar duplicado
    const existingArtistId = await Artist.findOne({ name });

    if (existingArtistId) {
      return res.status(422).json({
        data: { message: "Ya existe un artista con ese nombre" },
      });
    }

    // 💾 Crear artista
    const newArtistId = new Artist({ name, image, albumId });
    const savedArtist = await newArtistId.save();

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

    console.error("❌ Error al crear el artista", errorMessage);

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
const getAllArtistsId = async (req, res) => {
  try {
    console.log("📋 Obteniendo lista de artistas...");

    const artistsId = await Artist.find()
      .populate("albumId", "title releaseDate coverImage")
      .populate("songId", "title duration");

    console.log("✅ Artistas encontrados:", artistsId.length);

    const response = {
      data: {
        message: "Artistas encontrados",
        result: artistsId,
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

    const artistId = await Artist.findById(id).populate(
      "albumId",
      "title coverImage releaseDate"
    );

    if (!artistId) {
      return res.status(400).json({
        data: { message: "Artista no encontrado" },
      });
    }

    const response = {
      data: {
        message: "Artista encontrado correctamente",
        result: artistId,
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
const updateArtistId = async (req, res) => {
  try {
    console.log(`✏️ Actualizando artista con ID: ${id}`);

    const { id } = req.params;
    const { name, image } = req.body;

    // 🔹 Validar datos
    const validationError = validateArtistData(req.body);
    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    // 🔹 Verificar duplicado (si el nombre cambia)
    const existingArtist = await Artist.findOne({ name });

    if (existingArtist && existingArtist._id.toString() !== id) {
      return res.status(422).json({
        data: {
          message: "Ya existe otro artista con ese nombre",
        },
      });
    }

    // 🔹 Actualizar datos
    const updatedArtist = await Artist.findByIdAndUpdate(
      id,
      { name, image },
      { new: true }
    );

    if (!updatedArtist) {
      return res.status(404).json({
        data: { message: "Artista no encontrado" },
      });
    }

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

    console.log(`✏️ Eliminando artista con ID: ${id}`);

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

    // ✅ Respuesta al cliente
    const response = {
      data: {
        message:
          "Artista eliminado correctamente junto con sus álbumes relacionados",
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
  getAllArtistsId,
  getArtistById,
  updateArtistId,
  deleteArtist,
};
