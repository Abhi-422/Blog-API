


import { jest } from '@jest/globals'; // Explicitly import jest

// 1. Mock the module BEFORE importing the controller
jest.unstable_mockModule("../models/user.model.js", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

// 2. Dynamically import the controller and User model
const { registerUser } = await import("./user.controller.js");
const { User } = await import("../models/user.model.js");

describe("User Controller - registerUser Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
    req = {
      body: {
        fullname: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test("should register user successfully", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "123", username: "johndoe" });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: "123", username: "johndoe" }),
    });

    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
