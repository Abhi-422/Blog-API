import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// get all posts
const getAllPosts = async (req, res) => {
  // fetch all posts from database
  const posts = await Post.find();
  // return posts in response
  res.json(new ApiResponse(200, "Posts fetched successfully", posts));
};

// create a new post
const createPost = async (req, res) => {
  // take data from req.body
  const { title, content, author } = req.body;
  // validate data
  if (!title || !content || !author) {
    throw new ApiError(400, "Title, content and author are required");
  }
  const loggedInUserId = req.user._id;
  if (author !== loggedInUserId.toString()) {
    throw new ApiError(403, "You are not authorized to create post for another user");
  }
  // save to database
  const newPost = await Post.create({ title, content, author });
  if (!newPost) {
    throw new ApiError(500, "Failed to create post");
  }

  const createdPost = await Post.findById(newPost._id);
  if (!createdPost) {
    throw new ApiError(500, "Failed to retrieve created post");
  }
    // return created post in response
    res.status(201).json(new ApiResponse(201, "Post created successfully", createdPost));
};

// get a single post by ID
const getPostById = async (req, res) => {
  // fetch post by ID from database
  const postId = req.params.id;
  const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    res.json(new ApiResponse(200, "Post fetched successfully", post));
  // return post in response
};

// update a post by ID
const updatePostById = async (req, res) => {
  // fetch post by ID from database
  const postId = req.params.id;
  const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const loggedInUserId = req.user._id;
    if (post.author.toString() !== loggedInUserId.toString()) {
        throw new ApiError(403, "You are not authorized to update this post");
    }

  // update post data
    const { title, content } = req.body;
    if (!title && !content) {
        throw new ApiError(400, "At least one field (title or content) is required to update");
    }
    if (title) post.title = title;
    if (content) post.content = content;

  // save updated post to database
    const updatedPost = await post.save();
    if (!updatedPost) {
        throw new ApiError(500, "Failed to update post");
    }
  // return updated post in response
    res.json(new ApiResponse(200, "Post updated successfully", updatedPost));
};

// delete a post by ID
const deletePostById = async (req, res) => {
  // fetch post by ID from database
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const loggedInUserId = req.user._id;
    if (post.author.toString() !== loggedInUserId.toString() && req.user.isAdmin !== true) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }
    // delete post from database
    await Post.findByIdAndDelete(postId);
    res.json(new ApiResponse(200, "Post deleted successfully"));

  // return success message in response
};

export { createPost, getAllPosts, getPostById, updatePostById, deletePostById };
