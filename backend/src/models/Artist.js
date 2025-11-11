const mongoose = require("mongoose");

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

module.exports = mongoose.model("Artist", artistSchema);
