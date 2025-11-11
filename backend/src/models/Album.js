const mongoose = require("mongoose");
const Artist = require("./Artist");

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
    tracklist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: false },
    ],
  },
  { timestamps: true }
);

// ✅ Middleware: al guardar un álbum → se agrega su ID al artista
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
albumSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Artist.findByIdAndUpdate(this.artistId, {
        $pull: { albumId: this._id },
      });

      console.log(`🧽 Álbum ${this._id} eliminado de artista ${this.artistId}`);

      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mongoose.model("Album", albumSchema);
