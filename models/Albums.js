const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    albumName: {
      type: String,
    },
    userId: {
      type: String,
    },
    user: {
      type: Object,
      required: false,
    },
    photo: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
