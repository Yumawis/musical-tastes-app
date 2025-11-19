const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    releaseDate: { type: Date },
    duration: { type: String, require: true },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,
    },
  },
  { timestamps: true }
);

songSchema.pre("save", async function (next) {
  try {
    const albumId = this.albumId;

    if (albumId) {
      // Validar formato id
      if (!mongoose.Types.ObjectId.isValid(albumId)) {
        return next(new Error("El ID del álbum no es válido"));
      }

      // Verificar existencia del álbum
      const Album = mongoose.model("Album");

      const album = await Album.findById(albumId);

      if (!album) return next(new Error("El álbum indicado no existe"));
    }

    return next();
  } catch (err) {
    return next(err);
  }
});

songSchema.post("save", { document: true, query: false }, async function (doc) {
  try {
    const albumId = doc.albumId;

    if (!albumId) {
      console.log("🎵 La canción no se agrega a ningún álbum porque no tiene albumId");
      return;
    }

    const Album = mongoose.model("Album");

    await Album.findByIdAndUpdate(albumId, {
      $addToSet: { tracklist: doc._id },
    });

    console.log(`🎵 La canción ${doc._id} fue agregada al álbum ${albumId}`);
  } catch (error) {
    console.error("❌ Error agregando la canción álbum:", error);
  }
});

songSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    const songId = this._id;
    const albumId = this.albumId;

    if (albumId) {
      console.log(`🧹 Eliminando canción ${songId} del álbum ${albumId}...`);

      const Album = mongoose.model("Album");

      await Album.findByIdAndUpdate(albumId, {
        $pull: { tracklist: songId },
      });

      console.log("✔️ Canción removida del tracklist del álbum");
    }
    next();
  } catch (error) {
    console.error("❌ Error en Song pre deleteOne:", error);

    next(error);
  }
});

module.exports = mongoose.model("Song", songSchema);
