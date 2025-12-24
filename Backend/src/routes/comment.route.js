import {getCommentsByPostId, addCommentToPost, getCommentById, updateCommentById, deleteCommentById} from '../controllers/comment.controller.js';
import {Router} from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/post/:postId", getCommentsByPostId);
router.post("/post/:postId",verifyJWT, addCommentToPost);
router.get("/:commentId", getCommentById);
router.put("/:commentId", verifyJWT, updateCommentById);
router.delete("/:commentId", verifyJWT, deleteCommentById);

export default router;