const mongoose = require("mongoose");

const favoriteAlbumSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    albums: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FavoriteAlbum", favoriteAlbumSchema);
