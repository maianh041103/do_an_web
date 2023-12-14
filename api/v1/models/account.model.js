const mongoose = require('mongoose');
const generate = require('../../../helper/generate.helper');

const accountSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  token:
  {
    type: String,
    //default: generate.generateRandomString(20)
  },
  phone: String,
  address: String,
  avatar: String,
  role_id: {
    type: String,
    default: "6568a9f308e5088688d1c345"
  },
  status: {
    type: String,
    default: "active"
  },
  rank: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: {
    account_id: String,
    updatedAt: Date
  }
}, {
  timestamps: true
})

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;