const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, require: true, unique: true },
    nameNormalized: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      select: false,
    },
    genre: {
      type: String,
      enum: {
        values: ["Electronic", "K-pop", "Rock & Roll", "Hip Hop", "Pop", "Rock"],
        message: "{VALUE} no es un género válido",
      },
      required: true,
    },
    image: String,
  },
  { timestamps: true }
);

artistSchema.index(
  { nameNormalized: 1 },
  { unique: true, collation: { locale: "es", strength: 2 } }
);

artistSchema.pre("validate", function (next) {
  if (this.name) {
    this.nameNormalized = this.name.toLowerCase().trim();
  }
  next();
});

artistSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const artistId = this._id; //✅ "this" apunta al documento (el artista)

    console.log(`🧹 Eliminando álbumes y canciones del artista: ${artistId}`);

    // 👉 Usamos mongoose.model("Album") sin require()
    const Album = mongoose.model("Album");
    const Song = mongoose.model("Song");

    // Buscar todos los álbumes de este artista
    const albums = await Album.find({ artistId });

    // Iteración que recorre los albumes para eliminarlos
    for (const album of albums) {
      // 🔸 Eliminar canciones del álbum
      const deletedSongs = await Song.deleteMany({ albumId: album._id });

      console.log(`🎶 Canciones eliminadas del álbum ${album.title}: ${deletedSongs.deletedCount}`);

      // 🔸 Eliminar el álbum (dispara su propio middleware)
      await album.deleteOne();
    }

    console.log(`✅ Álbumes eliminados del artista ${artistId}: ${albums.length}`);

    // 🔸 Eliminar canciones que tengan directamente el artistId (si las hay)
    const directSongs = await Song.deleteMany({ artistId });

    if (directSongs.deletedCount > 0) {
      console.log(`🎵 Canciones eliminadas directamente del artista: ${directSongs.deletedCount}`);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Artist", artistSchema);
