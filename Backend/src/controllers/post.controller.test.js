import { jest } from '@jest/globals';

// 1. Mock the Post model BEFORE importing the controller
await jest.unstable_mockModule("../models/post.model.js", () => ({
  Post: {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// 2. Dynamically import the controller and the mocked model
const { createPost, getAllPosts, getPostById } = await import("./post.controller.js");
const { Post } = await import("../models/post.model.js");

describe("Post Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  // Test for getAllPosts
  test("getAllPosts should return all posts with 200 status", async () => {
    const mockPosts = [{ title: "Post 1" }, { title: "Post 2" }];
    Post.find.mockResolvedValue(mockPosts);

    await getAllPosts(req, res);

    expect(Post.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 200,
        data: mockPosts,
        message: "Posts fetched successfully"
      })
    );
  });

  // Test for createPost
  test("createPost should throw 400 if title is missing", async () => {
    req.body = { content: "Missing title", author: "User1" };

    // Controllers throw ApiError which are caught by asyncHandler
    await expect(createPost(req, res)).rejects.toThrow("Title, content and author are required");
  });

  test("createPost should save post and return 201", async () => {
    const postData = { title: "New Post", content: "Hello", author: "User1" };
    req.body = postData;
    
    const mockNewPost = { _id: "post123", ...postData };
    Post.create.mockResolvedValue(mockNewPost);
    Post.findById.mockResolvedValue(mockNewPost);

    await createPost(req, res);

    expect(Post.create).toHaveBeenCalledWith(postData);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 201,
        message: "Post created successfully",
        data: mockNewPost
      })
    );
  });

  // Test for getPostById
  test("getPostById should return 404 if post not found", async () => {
    req.params.id = "invalid-id";
    Post.findById.mockResolvedValue(null);

    await expect(getPostById(req, res)).rejects.toThrow("Post not found");
  });
});
