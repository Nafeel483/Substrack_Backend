const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
    },
    recId: {
      type: String,
    },
    roomId: {
        type: String,
      },
      message: {
        type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
