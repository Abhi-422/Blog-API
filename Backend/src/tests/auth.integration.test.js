import request from "supertest";
import { app } from "../app.js"; // Import your Express app instance
import * as dbHandler from "./dbHandler.js";

// Setup and teardown for the database
beforeAll(async () => {
    await dbHandler.connect();
    process.env.ACCESS_TOKEN_SECRET = "testsecret123";
    process.env.REFRESH_TOKEN_SECRET = "testsecret456";
    process.env.ACCESS_TOKEN_EXPIRY = "1d";
    process.env.REFRESH_TOKEN_EXPIRY = "10d";
});
afterEach(async () => await dbHandler.clear());
afterAll(async () => await dbHandler.close());

describe("User Authentication Flow", () => {
    const mockUser = {
        fullname: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123"
    };

    it("should register a user and then allow them to login", async () => {
        // 1. REGISTER
        const registerRes = await request(app)
            .post("/api/v1/user/register")
            .send(mockUser);

        expect(registerRes.status).toBe(201);
        expect(registerRes.body.data.username).toBe("johndoe");

        // 2. LOGIN
        const loginRes = await request(app)
            .post("/api/v1/user/login")
            .send({
                username: "johndoe",
                password: "password123"
            });

        expect(loginRes.status).toBe(200);
        expect(loginRes.body.data.user).toHaveProperty("accessToken");

    });

    it("should fail to login with wrong password", async () => {
        // Pre-register user
        await request(app).post("/api/v1/user/register").send(mockUser);

        const res = await request(app)
            .post("/api/v1/user/login")
            .send({ username: "johndoe", password: "wrongpassword" });

        expect(res.status).toBe(401); // Unauthorized
    });
});
