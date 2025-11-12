const Album = require("../models/Album");
const Artist = require("../models/Artist");

const { validateAlbumData } = require("../validators/albumValidator");

// 👉 Crear álbum
const createAlbum = async (req, res) => {
  try {
    console.log("💿 Creando nuevo álbum...");

    const { title, releaseDate, coverImage, artistId, tracklist } = req.body;

    // 🧩 Validación
    const validationError = validateAlbumData({ artistId, title });

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    // ⚠️ Verificar que exista el artista
    const existingArtist = await Artist.findById(artistId);

    if (!existingArtist) {
      return res.status(422).json({
        data: {
          message: "El artista proporcionado no existe en la base de datos",
        },
      });
    }

    // ⚠️ Verificar duplicados
    const existingAlbum = await Album.findOne({ artistId, title });

    if (existingAlbum) {
      return res.status(422).json({
        data: {
          message: "Ya existe un álbum con ese título para este artista",
        },
      });
    }

    // ✅ Crear el álbum si pasa las validaciones
    const newAlbum = new Album({
      title,
      releaseDate,
      coverImage,
      artistId,
      tracklist,
    });

    // Actualizar el artista automáticamente
    const savedAlbum = await newAlbum.save();

    console.log("✅ Albúm creado:", savedAlbum);

    const response = {
      data: {
        message: "Álbum creado exitosamente",
        albumID: savedAlbum._id,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error al crear el álbum", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al crear el álbum",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener todos los álbumes
const getAllAlbums = async (req, res) => {
  try {
    console.log("🎵 Obteniendo todos los álbumes...");

    const albums = await Album.find()
      .populate("artistId", "name image")
      .populate("tracklist", "title duration");

    if (albums.length === 0) {
      return res.status(404).json({
        data: { message: "No hay álbumes registrados aún." },
      });
    }

    const response = {
      data: {
        message: "Álbumes obtenidos correctamente",
        result: albums,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error interno al obtener los álbumes:", errorMessage);

    const response = {
      data: {
        message: "Error al obtener los álbumes",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener un álbum por ID
const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Buscando álbum con ID: ${id}`);

    const album = await Album.findById(id)
      .populate("artistId", "name image")
      .populate("tracklist", "title duration releaseDate");

    if (!album) {
      return res.status(404).json({
        data: { message: "Álbum no encontrado" },
      });
    }

    const response = {
      data: {
        message: "Álbum encontrado correctamente",
        result: album,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error obteniendo el álbum por ID:", errorMessage);

    const response = {
      data: {
        message: "Error al obtener el álbum",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Actualizar álbum
const updateAlbum = async (req, res) => {
  try {
    console.log(`✏️ Actualizando álbum con ID: ${id}`);

    const { id } = req.params;
    const { title, artist } = req.body;

    // 🧩 Validación de datos
    const validationError = validateAlbumData({ title, artistId });

    if (validationError) {
      return res.status(400).json({
        data: { message: validationError },
      });
    }

    // 💾 Actualizar el álbum
    const updatedAlbum = await Album.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedAlbum) {
      return res.status(404).json({
        data: { message: "Album no encontrado" },
      });
    }

    const response = {
      data: {
        message: "Álbum actualizado correctamente",
        result: updatedAlbum,
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

// 👉 Eliminar álbum
const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✏️ Eliminando artista con ID: ${id}`);

    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({
        data: {
          message: "El álbum no existe o ya fue eliminado",
        },
      });
    }

    await album.deleteOne();

    console.log(`✅ Álbum eliminado correctamente`);

    const response = {
      data: {
        message: "Álbum eliminado correctamente y desvinculado al artista",
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error eliminando el álbum:", errorMessage);

    const response = {
      data: {
        message: "Error al eliminar el álbum",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
};
