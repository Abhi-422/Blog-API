import request from "supertest";
import { app } from "../app.js"; // Adjust path to your express app
import * as dbHandler from "./dbHandler.js";

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clear());
afterAll(async () => await dbHandler.close());

describe("Social System Integration (Posts & Comments)", () => {
  let accessToken;
  let userId;

  beforeEach(async () => {
    await dbHandler.clear(); // CLEAR DB FIRST

    // Set dummy secrets for the test environment
    process.env.ACCESS_TOKEN_SECRET = "testsecret123";
    process.env.REFRESH_TOKEN_SECRET = "testsecret456";
    process.env.ACCESS_TOKEN_EXPIRY = "1d";
    process.env.REFRESH_TOKEN_EXPIRY = "10d";

    const userData = {
      fullname: "Social Tester",
      username: "socialtester",
      email: "social@test.com",
      password: "password123",
    };

    const reg = await request(app)
      .post("/api/v1/user/register")
      .send(userData);

    // Safety check: if registration fails, the test stops here with a clear error
    if (reg.status !== 201) {
      throw new Error(`Registration failed: ${JSON.stringify(reg.body)}`);
    }

    userId = reg.body.data._id;

    const login = await request(app).post("/api/v1/user/login").send({
      username: "socialtester",
      password: "password123",
    });

    if (login.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(login.body)}`);
    }

    accessToken = login.body.data.user.accessToken;
  });

  it("should allow a user to create a post, comment on it, and then delete the comment", async () => {
    // 1. CREATE A POST
    const postRes = await request(app)
      .post("/api/v1/post")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Integration Post",
        content: "Testing the full social flow",
        author: userId,
      });

    expect(postRes.status).toBe(201);
    
    const postId = postRes.body.data._id;

    // 2. ADD A COMMENT TO THAT POST
    const commentRes = await request(app)
      .post(`/api/v1/comment/post/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userId: userId,
        content: "This is a real integration comment!",
      });

    expect(commentRes.status).toBe(201);
    const commentId = commentRes.body.data._id;

    // 3. GET ALL COMMENTS FOR THE POST
    const getComments = await request(app).get(
      `/api/v1/comment/post/${postId}`
    );

    expect(getComments.status).toBe(200);
    expect(getComments.body.data.length).toBe(1);
    expect(getComments.body.data[0].content).toBe(
      "This is a real integration comment!"
    );

    // 4. DELETE THE COMMENT
    const deleteRes = await request(app)
      .delete(`/api/v1/comment/${commentId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteRes.status).toBe(200);
  });

  it("should fail to create a post if the title is missing", async () => {
    const res = await request(app)
      .post("/api/v1/post")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "No title here",
        author: userId,
      });

    expect(res.status).toBe(400); // Bad Request
  });
});
