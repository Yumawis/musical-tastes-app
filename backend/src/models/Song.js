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

module.exports = mongoose.model("Song", songSchema);
