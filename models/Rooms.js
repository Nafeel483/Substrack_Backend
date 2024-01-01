const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    userIdOne: {
      type: String,
    },
    userIdTwo: {
      type: String,
    },
    roomId: {
        type: String,
      },
    active: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
