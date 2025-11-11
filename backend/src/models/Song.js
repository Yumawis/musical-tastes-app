const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    releaseDate: { type: Date, require: true },
    duration: { type: String, require: true },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,
      require: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
