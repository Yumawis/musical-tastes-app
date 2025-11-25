const Artist = require("../models/Artist");
const Album = require("../models/Album");
const Song = require("../models/Song");

const { validateSong } = require("../validators/songValidator");
const { buildSongUpdateData } = require("../builders/songBuilder");
const { normalizeId } = require("../utilities/normalize");

// 👉 Crear canción
const createSong = async (req, res) => {
  try {
    const { title, artistId, releaseDate, duration, albumId, type } = req.body;
    // ✅ Validar datos
    const validationError = validateSong({
      title,
      artistId,
      releaseDate,
      duration,
      albumId,
      type,
    });

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    let currentArtistId = null;
    let currentReleaseDate = null;

    if (artistId) {
      // 🔎 Verificar que el artista exista
      const existingArtist = await Artist.findById(artistId);

      if (!existingArtist) {
        return res.status(404).json({
          data: { message: "El artista enviado no existe" },
        });
      }

      currentArtistId = artistId;
      currentReleaseDate = releaseDate;

      // 🔍 Verificar duplicados por artista y título
      const existingSong = await Song.findOne({ artistId, title });

      if (existingSong) {
        return res.status(422).json({
          data: {
            message: "Ya existe una canción con ese título para este artista",
          },
        });
      }
    }

    if (albumId) {
      // 🔎 Verificar que el album exista
      const existingAlbum = await Album.findById(albumId);

      if (!existingAlbum) {
        return res.status(404).json({
          data: { message: "El álbum enviado no existe" },
        });
      }

      currentArtistId = existingAlbum.artistId;
      currentReleaseDate = existingAlbum.releaseDate;

      // 🔍 Verificar duplicados dentro del álbum
      const existingSong = await Song.findOne({ albumId, title });

      if (existingSong) {
        return res.status(422).json({
          data: {
            message: "Ya existe una canción con ese título en este álbum",
          },
        });
      }
    }

    const newSongData = {
      title,
      artistId: currentArtistId,
      releaseDate: currentReleaseDate,
      duration,
      type,
    };

    if (albumId) newSongData.albumId = albumId;

    // 💾 Crear nueva canción
    const newSong = new Song(newSongData);

    const savedSong = await newSong.save();

    console.log("✅ Canción creada:", savedSong);

    // ✅ Respuesta final
    const response = {
      data: {
        message: "Canción creada correctamente",
        album: savedSong,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error al crear la canción", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error creando la canción",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener todas las canciones
const getAllSong = async (req, res) => {
  try {
    const songs = await Song.find();

    console.log("✅ Canciones obtenidas:", songs.length);

    const response = {
      data: {
        message: "Canciones obtenidas correctamente",
        result: songs,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error al obtener las canciones:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al obtener las canciones",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Obtener una canción por ID
const getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Buscando canciones con ID: ${id}`);

    const song = await Song.findById(id)
      .populate("artistId", "name image")
      .populate("albumId", "title releaseDate coverImage");

    if (!song) {
      return res.status(404).json({
        data: { message: "Canción no encontrada" },
      });
    }

    console.log("✅ Canción obtenida:", song);

    const response = {
      data: {
        message: "Canción obtenida correctamente",
        result: song,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error obteniendo la canción por ID:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al obtener la canción",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Actualizar canción
const updateSong = async (req, res) => {
  try {
    const { id } = req.params;

    const currentSong = await Song.findById(id);

    if (!currentSong) {
      return res.status(404).json({
        data: { message: "Canción no encontrada" },
      });
    }

    const newData = req.body;

    const currentAlbumId = normalizeId(newData?.albumId);

    if (currentAlbumId && currentAlbumId !== currentSong?.albumId) {
      return res.status(400).json({
        data: { message: "No puedes editar una canción que pertenece a un álbum diferente" },
      });
    }

    if (currentAlbumId && !currentSong?.albumId) {
      return res.status(400).json({
        data: { message: "No puedes asignar un álbum a un sencillo" },
      });
    }

    const updateSong = buildSongUpdateData(currentSong, newData);

    // Si no hay nada válido para actualizar
    if (Object.keys(updateSong).length === 0) {
      return res.status(400).json({
        data: { message: "No hay campos válidos para actualizar" },
      });
    }

    const updatedSong = await Song.findByIdAndUpdate(id, updateSong, { new: true });

    console.log("✏️ Canción actualizada:", updatedSong);

    const response = {
      data: {
        message: "Canción actualizada correctamente",
        result: updatedSong,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error actualizando la canción:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al actualizar la canción",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

// 👉 Eliminar canción
const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔎 Buscar la canción
    const song = await Song.findById(id);

    if (!song) {
      return res.status(400).json({
        data: { message: "La canción no existe o ya fue eliminada" },
      });
    }

    // 🗑️ Eliminar la canción (aquí se ejecuta el middleware)
    await song.deleteOne();

    console.log("🧹 Canción eliminada correctamente");

    const response = {
      data: {
        message: "Canción eliminada correctamente",
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;

    console.error("❌ Error eliminando la canción:", errorMessage);

    const response = {
      data: {
        message: "Ocurrió un error al eliminar la canción",
        error: errorMessage,
      },
    };

    return res.status(422).json(response);
  }
};

module.exports = {
  createSong,
  getAllSong,
  getSongById,
  updateSong,
  deleteSong,
};
