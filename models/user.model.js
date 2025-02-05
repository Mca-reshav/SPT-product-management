const { mongoose } = require("../database/mongo.conn");
const moment = require('moment');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    allowNull: false,
  },
  emailId: {
    type: String,
    required: true,
    allowNull: false,
    unique: true,
  },
  contactNo: {
    type: Number,
    required: true,
    allowNull: false,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: moment().format('YYYY-MM-DD HH:mm:ss'),
  },
  updatedAt: {
    type: String,
    allowNull: true,
  },
});

exports.UserSPT = mongoose.model("UserSPT", userSchema);
