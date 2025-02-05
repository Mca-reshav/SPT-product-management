const express = require("express");
const usersRoutes = require("./user.routes");
const productsRoutes = require("./product.routes");

const router = express.Router();

// Route setup
router.use("/user", usersRoutes);
router.use("/product", productsRoutes);

module.exports = router;
