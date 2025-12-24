import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { Post } from "../models/post.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getCommentsByPostId = async (req, res) => {
  //fetch comments by post ID from database
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const comments = await Comment.find({ post: postId });
  if (!comments) {
    throw new ApiError(404, "No comments found for this post");
  }
  //return comments in response
  res.json(new ApiResponse(200, "Comments fetched successfully", comments));
};

const addCommentToPost = async (req, res) => {
  //take data from req.body
  const { postId } = req.params;
  const post = Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const { userId, content } = req.body;

  //validate data
  if (!userId || !content) {
    throw new ApiError(400, "User ID and content are required");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //save comment to database
  const comment = await Comment.create({ post: postId, user: userId, content });
  if (!comment) {
    throw new ApiError(500, "Failed to create comment");
  }
  const createdComment = await Comment.findById(comment._id);
  if (!createdComment) {
    throw new ApiError(500, "Failed to retrieve created comment");
  }
  //return created comment in response
  res.status(201).json(new ApiResponse(201, "Comment added successfully", createdComment));
};

const getCommentById = async (req, res) => {
  //get comment ID from req.params
  const { commentId } = req.params;
  //fetch comment by ID from database
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  //return comment in response
  res.json(new ApiResponse(200, "Comment fetched successfully", comment));
};

const updateCommentById = async (req, res) => {
  //get comment ID from req.params
  const { commentId } = req.params;
  //check if the user is the owner of the comment
  //fetch comment by ID from database
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  const loggedInUserId = req.user._id;
  if (comment.user.toString() !== loggedInUserId.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }
  //update comment data
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required to update comment");
  }
  //update comment data
  comment.content = content;

  //save updated comment to database
  const updatedComment = await comment.save();
  if (!updatedComment) {
    throw new ApiError(500, "Failed to update comment");
  }
  //return updated comment in response
  res.json(
    new ApiResponse(200, "Comment updated successfully", updatedComment)
  );
};

const deleteCommentById = async (req, res) => {
  //get comment ID from req.params
  const { commentId } = req.params;
  //fetch comment by ID from database
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  const loggedInUserId = req.user._id;
  if (comment.user.toString() !== loggedInUserId.toString() && req.user.isAdmin !== true) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }
  //delete comment from database
  await Comment.findByIdAndDelete(commentId);
  //return success message in response
  res.json(new ApiResponse(200, "Comment deleted successfully"));
};

export {
  getCommentsByPostId,
  addCommentToPost,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};
