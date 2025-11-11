const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true, unique: true },
    releaseDate: { type: Date, require: true },
    coverImage: String,
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    tracklist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Song", require: false },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);
