import { jest } from '@jest/globals';

// 1. Mock all dependent models BEFORE importing the controller
await jest.unstable_mockModule("../models/user.model.js", () => ({
  User: { findById: jest.fn() }
}));

await jest.unstable_mockModule("../models/post.model.js", () => ({
  Post: { findById: jest.fn() }
}));

await jest.unstable_mockModule("../models/comment.model.js", () => ({
  Comment: {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

// 2. Dynamically import everything AFTER the mocks are ready
const { 
  getCommentsByPostId, 
  addCommentToPost, 
  updateCommentById 
} = await import("../controllers/comment.controller.js");

const { Post } = await import("../models/post.model.js");
const { Comment } = await import("../models/comment.model.js");
const { User } = await import("../models/user.model.js");

describe("Comment Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  // --- Test for getCommentsByPostId ---
  test("getCommentsByPostId should throw 404 if post does not exist", async () => {
    req.params.postId = "post123";
    Post.findById.mockResolvedValue(null); // Simulate post not found

    await expect(getCommentsByPostId(req, res)).rejects.toThrow("Post not found");
  });

  test("getCommentsByPostId should return comments if post exists", async () => {
    req.params.postId = "post123";
    const mockComments = [{ content: "Nice post!" }];
    
    Post.findById.mockResolvedValue({ _id: "post123" });
    Comment.find.mockResolvedValue(mockComments);

    await getCommentsByPostId(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Comments fetched successfully",
        data: mockComments
      })
    );
  });

  // --- Test for addCommentToPost ---
  test("addCommentToPost should throw 400 if content is missing", async () => {
    req.params.postId = "post123";
    req.body = { userId: "user123" }; // Missing content
    
    Post.findById.mockResolvedValue({ _id: "post123" });

    await expect(addCommentToPost(req, res)).rejects.toThrow("User ID and content are required");
  });

  test("addCommentToPost should succeed with valid data", async () => {
    req.params.postId = "post123";
    req.body = { userId: "user123", content: "Great work!" };

    const mockComment = { _id: "comm123", content: "Great work!" };

    Post.findById.mockResolvedValue({ _id: "post123" });
    User.findById.mockResolvedValue({ _id: "user123" });
    Comment.create.mockResolvedValue(mockComment);
    Comment.findById.mockResolvedValue(mockComment);

    await addCommentToPost(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 201,
        message: "Comment added successfully"
      })
    );
  });

  // --- Test for updateCommentById ---
  test("updateCommentById should update content and save", async () => {
    req.params.commentId = "comm123";
    req.body = { content: "Updated content" };

    // Mock a comment object that has a .save() method
    const mockCommentInstance = {
      _id: "comm123",
      content: "Old content",
      save: jest.fn().mockResolvedValue({ _id: "comm123", content: "Updated content" })
    };

    Comment.findById.mockResolvedValue(mockCommentInstance);

    await updateCommentById(req, res);

    expect(mockCommentInstance.content).toBe("Updated content");
    expect(mockCommentInstance.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Comment updated successfully"
      })
    );
  });
});
