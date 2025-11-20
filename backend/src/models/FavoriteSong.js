const mongoose = require("mongoose");

const favoriteSongSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    songs: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FavoriteSong", favoriteSongSchema);
