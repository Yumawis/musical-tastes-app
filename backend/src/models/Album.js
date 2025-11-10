const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true, unique: true },
    releaseDate: Date,
    coverImage: String,
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    tracklist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);
