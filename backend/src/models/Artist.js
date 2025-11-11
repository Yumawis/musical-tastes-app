const mongoose = require("mongoose");
const Album = require("./Album");

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, require: true, unique: true },
    genre: {
      type: String,
      enum: ["Electronic", "K-pop", "Rock & Roll", "Hip Hop", "Pop", "Rock"],
    },
    image: String,
    albumId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Album", require: false },
    ],
    songId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Song", require: false },
    ],
  },
  { timestamps: true }
);

artistSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const artistId = this._id; //✅ "this" apunta al documento (el artista)

      console.log(
        `🧹 Eliminando álbumes relacionados con el artista: ${artistId}`
      );

      const deletedAlbums = await Album.deleteMany({ artist: artistId });

      console.log(`Álbumes eliminados: ${deletedAlbums.deletedCount}`);

      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mongoose.model("Artist", artistSchema);
