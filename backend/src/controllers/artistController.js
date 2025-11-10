const Artist = require("../models/Artist");
const Album = require("../models/Album");
const { validateArtistData } = require("../validators/artistValidator");

// 👉 Crear artista
const createArtist = async (req, res) => {
  try {
    const { name, image, album } = req.body;

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
    const existingArtist = await Artist.findOne({ name });

    if (existingArtist) {
      return res.status(422).json({
        data: { message: "Ya existe un artista con ese nombre" },
      });
    }

    // 💾 Crear artista
    const newArtist = new Artist({ name, image, album });
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
const getAllArtists = async (req, res) => {
  try {
    console.log("📋 Obteniendo lista de artistas...");

    const artists = await Artist.find().populate(
      "album",
      "title releaseDate coverImage"
    );

    console.log("✅ Artistas encontrados:", artists.length);

    const response = {
      data: {
        message: "Artistas encontrados",
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

    const artist = await Artist.findById(id).populate(
      "album",
      "title coverImage releaseDate"
    );

    if (!artist) {
      return res.status(400).json({
        data: { message: "Artista no encontrado" },
      });
    }

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
    console.log(`✏️ Actualizando artista con ID: ${req.params.id}`);

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
    console.log(`✏️ Eliminando artista con ID: ${req.params.id}`);

    const deletedArtist = await Artist.findByIdAndDelete(req.params.id);

    if (!deletedArtist) {
      return res.status(404).json({
        data: {
          message: "El artista no existe o ya fue eliminado",
        },
      });
    }

    const response = {
      data: {
        message: "Artista eliminado correctamente",
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
