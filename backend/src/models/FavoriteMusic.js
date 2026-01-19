const mongoose = require("mongoose");

const favoriteMusicSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    songs: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }] },
    albums: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FavoriteMusic", favoriteMusicSchema);
