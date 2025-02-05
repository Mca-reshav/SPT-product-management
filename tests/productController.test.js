const request = require("supertest");
const express = require("express");
const productController = require("../controllers/productController");
const { create, findOne, updateOne, pagination } = require("../services/mongo.service");
const commonService = require("../services/common.service");
const { log } = require("../services/response.service");

jest.mock("../services/mongo.service");
jest.mock("../services/common.service");

const app = express();
app.use(express.json());
app.post("/product/add", productController.add);
app.get("/product/show", productController.show);
app.put("/product/:productId", productController.edit);
app.put("/product/:productId/upload-img", productController.uploadImg);

describe("Product Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a new product", async () => {
    findOne.mockResolvedValue(null);
    commonService.generateProdID.mockReturnValue("prod123");
    create.mockResolvedValue({ productId: "prod123" });

    const response = await request(app)
      .post("/product/add")
      .send({
        name: "New Product",
        description: "Product description",
        price: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Product added successfully.");
  });

  it("should not add an existing product", async () => {
    findOne.mockResolvedValue({ productId: "prod123" });

    const response = await request(app)
      .post("/product/add")
      .send({
        name: "Existing Product",
        description: "Product description",
        price: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Product already exists.");
  });

  it("should show products", async () => {
    pagination.mockResolvedValue({
      data: [
        { productId: "prod123", name: "Product1", description: "Description1" },
        { productId: "prod124", name: "Product2", description: "Description2" },
      ],
    });

    const response = await request(app)
      .get("/product/show")
      .query({ searchText: "Product", page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  it("should edit a product", async () => {
    findOne.mockResolvedValue({ productId: "prod123" });
    updateOne.mockResolvedValue({ productId: "prod123", name: "Updated Product" });

    const response = await request(app)
      .put("/product/prod123")
      .send({
        name: "Updated Product",
        description: "Updated description",
        price: 150,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Product updated successfully.");
  });

  it("should not edit a non-existing product", async () => {
    findOne.mockResolvedValue(null);

    const response = await request(app)
      .put("/product/prod999")
      .send({
        name: "Non-existing Product",
        description: "Description",
        price: 200,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Product not found.");
  });

  it("should upload product image", async () => {
    findOne.mockResolvedValue({ productId: "prod123", image: null });
    updateOne.mockResolvedValue({ productId: "prod123", image: "imageUrl" });

    const response = await request(app)
      .put("/product/prod123/upload-img")
      .send({ image: "imageUrl" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Product image uploaded successfully.");
  });

  it("should not upload image if product does not exist", async () => {
    findOne.mockResolvedValue(null); 

    const response = await request(app)
      .put("/product/prod999/upload-img")
      .send({ image: "imageUrl" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Product not found.");
  });
});
