const express = require("express");
const { global, one } = require("../middlewares/main.mw");
const productController = require("../modules/product.controller");
const productValidator = require("../validators/product.validator");
const multer = require("multer");

const productRoutes = express.Router();
productRoutes.use(global);
const upload = multer({ dest: "uploads/" });
const routes = [
  {
    method: "get",
    path: "/show",
    middlewares: [one.webAuth],
    handler: productController.show,
  },
  {
    method: "post",
    path: "/add",
    middlewares: [one.webAuth, one.validate(productValidator.add)],
    handler: productController.add,
  },
  {
    method: "put",
    path: "/edit/:productId",
    middlewares: [one.webAuth, one.validate(productValidator.edit)],
    handler: productController.edit,
  },
  {
    method: "post",
    path: "/uploadImg/:productId",
    middlewares: [one.webAuth, upload.array(["image"])],
    handler: productController.uploadImg,
  },
  {
    method: "delete",
    path: "/delete/:productId",
    middlewares: [one.webAuth, one.validate(productValidator.delete)],
    handler: productController.deleteProduct,
  },
];

routes.forEach(({ method, path, middlewares = [], handler }) => {
  try {
    if (!productRoutes[method]) {
      console.warn(`Invalid method '${method}' for route '${path}'.`);
      return;
    }
    productRoutes[method](path, ...middlewares, handler);
  } catch (error) {
    console.error(`Failed to set up route ${path}:`, error);
  }
});

productRoutes.use((req, res) => {
  res.status(404).json({ error: "Resource Not Found" });
});

productRoutes.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = productRoutes;
