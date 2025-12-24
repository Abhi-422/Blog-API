import { Router } from "express";
import { createPost, getAllPosts, getPostById, updatePostById, deletePostById } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllPosts);
router.post("/", verifyJWT, createPost);
router.get("/:id", getPostById);
router.put("/:id", verifyJWT, updatePostById);
router.delete("/:id", verifyJWT, deletePostById);

export default router;