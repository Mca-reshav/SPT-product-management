const { mongoose } = require("../database/mongo.conn");
const moment = require("moment");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    allowNull: false,
  },
  name: {
    type: String,
    required: true,
    allowNull: false,
  },
  description: {
    type: String,
    required: true,
    allowNull: false,
  },
  price: {
    type: Number,
    required: true,
    allowNull: false,
  },
  image: {
    type: String,
    required: false,
    allowNull: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: false,
  },
  updatedBy: {
    type: String,
    required: false,
  },
});

exports.ProductSPT = mongoose.model("ProductSPT", productSchema);
