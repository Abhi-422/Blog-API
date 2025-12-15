import {getCommentsByPostId, addCommentToPost, getCommentById, updateCommentById, deleteCommentById} from '../controllers/comment.controller.js';
import {Router} from "express";

const router = Router();

router.get("/post/:postId", getCommentsByPostId);
router.post("/post/:postId", addCommentToPost);
router.get("/:commentId", getCommentById);
router.put("/:commentId", updateCommentById);
router.delete("/:commentId", deleteCommentById);

export default router;