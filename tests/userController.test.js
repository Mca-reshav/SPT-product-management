const request = require("supertest");
const express = require("express");
const userController = require("../modules/user.controller");
const { findOne, create } = require("../services/mongo.service");
const encryptService = require("../services/encrypt.service");
const { generateJwt } = require("../services/jwt.service");

jest.mock("../services/mongo.service");
jest.mock("../services/encrypt.service");
jest.mock("../services/jwt.service");

const app = express();
app.use(express.json());
app.post("/register", userController.register);
app.post("/login", userController.login);
app.get("/profile", userController.profile);

describe("User Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    findOne.mockResolvedValue(null);
    create.mockResolvedValue({ userId: "123", emailId: "test@example.com" });
    encryptService.hashPassword.mockResolvedValue("hashedPassword");

    const response = await request(app)
      .post("/register")
      .send({
        contactNo: "1234567890",
        emailId: "test@example.com",
        password: "password",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User registration successful.");
  });

  it("should not register an existing user", async () => {
    findOne.mockResolvedValue({ userId: "123" });

    const response = await request(app)
      .post("/register")
      .send({
        contactNo: "1234567890",
        emailId: "test@example.com",
        password: "password",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User already exists.");
  });

  it("should log in a user with correct credentials", async () => {
    findOne.mockResolvedValue({ userId: "123", password: "hashedPassword" });
    encryptService.comparePassword.mockResolvedValue(true);
    generateJwt.mockResolvedValue({ token: "generatedToken" });

    const response = await request(app)
      .post("/login")
      .send({ emailId: "test@example.com", password: "password" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBe("generatedToken");
  });

  it("should not log in with incorrect password", async () => {
    findOne.mockResolvedValue({ userId: "123", password: "hashedPassword" });
    encryptService.comparePassword.mockResolvedValue(false);

    const response = await request(app)
      .post("/login")
      .send({ emailId: "test@example.com", password: "wrongPassword" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Wrong password.");
  });

  it("should get user profile", async () => {
    findOne.mockResolvedValue({
      userId: "123",
      name: "John Doe",
      contactNo: "1234567890",
      emailId: "test@example.com",
      createdAt: "2023-02-05T00:00:00Z",
    });

    const response = await request(app)
      .get("/profile")
      .set("Authorization", "Bearer validToken");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("John Doe");
  });

  it("should not get profile if user is not registered", async () => {
    findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/profile")
      .set("Authorization", "Bearer validToken");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not registered.");
  });
});
