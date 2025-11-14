const Artist = require("../models/Artist");
const Song = require("../models/Song");
const Album = require("../models/Album");
const { validateSongData } = require("../validators/songValidator");

// 👉 Crear canción
const createSong = async (req, res) => {
  try {
    // ✅ Validar datos
    const validationError = validateSongData(req.body);

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    console.log("💿 Creando nueva canción...");

    const { title, artistId, releaseDate, duration, albumId } = req.body;

    // 🔎 Verificar que el artista exista
    const existingArtist = await Artist.findById(artistId);

    if (!existingArtist) {
      return res.status(404).json({
        data: { message: "El artista enviado no existe" },
      });
    }

    // 🔍 Verificar duplicados por artista y título
    const existingSong = await Song.findOne({ artistId, title });

    if (existingSong) {
      return res.status(422).json({
        data: {
          message: "Ya existe una canción con ese título para este artista",
        },
      });
    }

    // 💾 Crear nueva canción
    const newSong = new Song({
      title,
      artistId,
      releaseDate,
      duration,
      albumId,
    });

    const savedSong = await newSong.save();

    // ✅ Respuesta final
    const response = {
      data: {
        message: "Canción creada exitosamente",
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

    console.log("✅ Canciones encontradas:", songs.length);

    const response = {
      data: {
        message: "Canciones encontradas exitosamente",
        result: songs,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error al obtener las canciones:", errorMessage);

    const response = {
      data: {
        message: "Error al obtener las canciones",
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

    console.log("✅ Canción encontrada:", song);

    const response = {
      data: {
        message: "Canción encontrada correctamente",
        result: song,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    const errorMessage = error.message;
    console.error("❌ Error obteniendo la canción por ID:", errorMessage);

    const response = {
      data: {
        message: "Error al obtener la canción",
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

    const songData = req.body;

    // 🔹 Validar los datos antes de actualizar
    const validationError = validateSongData(songData);

    if (validationError) {
      return res.status(400).json({
        data: {
          message: validationError,
        },
      });
    }

    console.log(`✏️ Actualizando canción con ID: ${id}`);

    // 🔹 Intentar actualizar la canción
    const updatedSong = await Song.findByIdAndUpdate(id, songData, {
      new: true,
    });

    if (!updatedSong) {
      return res.status(404).json({
        data: { message: "Canción no encontrada" },
      });
    }

    console.log(`✏️ Canción ${id} actualizada correctamente`);

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
        message: "Error al actualizar la canción",
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

    console.log(`✏️ Eliminando canción con ID: ${id}`);

    // 🔎 Buscar la canción antes de eliminarla
    const song = await Song.findByIdAndDelete(id);

    if (!song) {
      return res.status(400).json({
        data: { message: "La canción no existe o ya fue eliminada" },
      });
    }

    // 💿 Si la canción pertenece a un álbum, eliminarla del tracklist
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { tracklist: song._id },
      });

      console.log("🧹 Canción eliminada del tracklist del álbum");
    }

    // 🗑️ Eliminar la canción
    await Song.findByIdAndDelete(id);

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
        message: "Error al eliminar la canción",
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
