const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  account_send: String,
  account_receive: String,
  content: String,
  images: Array,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
}, {
  timestamps: true
})

const Chat = mongoose.model("Chat", chatSchema, "chats");
module.exports = Chat;