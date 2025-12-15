import { Router } from "express";
import { createPost, getAllPosts, getPostById, updatePostById, deletePostById } from "../controllers/post.controller.js";

const router = Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.get("/:id", getPostById);
router.put("/:id", updatePostById);
router.delete("/:id", deletePostById);

export default router;