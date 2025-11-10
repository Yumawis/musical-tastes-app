const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, require: true, unique: true },
    genre: { type: String, trim: true, require: true },
    image: String,
    album: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artist", artistSchema);
