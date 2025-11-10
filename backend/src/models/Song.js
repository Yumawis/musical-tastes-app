const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    releaseDate: Date,
    duration: String,
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
