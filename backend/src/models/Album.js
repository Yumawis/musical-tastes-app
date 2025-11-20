const mongoose = require("mongoose");
const Artist = require("../models/Artist");
const FAVORITE_TYPES = require("../constants/favoriteTypes");

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true, unique: true },
    releaseDate: { type: Date, required: true },
    coverImage: String,
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    tracklist: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    },
    type: {
      type: String,
      trim: true,
      enum: FAVORITE_TYPES.ALBUM,
      default: FAVORITE_TYPES.ALBUM,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Middleware: al guardar un álbum → se agrega su ID al artista, arrow function
albumSchema.post("save", async function (doc) {
  try {
    await Artist.findByIdAndUpdate(doc.artistId, {
      $addToSet: { albumId: doc._id }, // evita duplicados
    });

    console.log(`🎵 Álbum agregado a artista ${doc.artistId}`);
  } catch (error) {
    console.error("❌ Error agregando álbum al artista:", error);
  }
});

// 🧹 Middleware: al eliminar un álbum → se quita del artista
albumSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const albumId = this._id;
    const artistId = this.artistId;

    console.log(`🧹 Eliminando canciones del álbum: ${albumId}`);

    // 🔸 Obtenemos el modelo Song sin importar dependencias circulares
    const Song = mongoose.model("Song");

    // 🔸 Eliminar canciones relacionadas con este álbum
    const deletedSongs = await Song.deleteMany({ albumId });

    console.log(`🎶 Canciones eliminadas: ${deletedSongs.deletedCount}`);

    // 🔸 Desvincular el álbum del artista
    await Artist.findByIdAndUpdate(this.artistId, {
      $pull: { albumId: this._id },
    });

    console.log(`🧽 Álbum ${albumId} desvinculado de artista ${artistId}`);

    next();
  } catch (error) {
    console.error("❌ Error al eliminar álbum o sus canciones:", error);

    next(error);
  }
});

module.exports = mongoose.model("Album", albumSchema);
