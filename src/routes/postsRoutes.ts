import { Router } from "express";
import {
  createUpdatePost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  getUsersLikedPosts,
  likeAPost,
  publishPost,
  unlikeAPost,
  unpublishPost,
} from "../controllers/postController";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.get("/user/:userId", getPostsByUserId);
router.post("/create-update-post", authenticateToken, createUpdatePost);
router.put("/publish/:postId", authenticateToken, publishPost);
router.put("/unpublish/:postId", authenticateToken, unpublishPost);
router.delete("/:postId/:userId", authenticateToken, deletePost);
router.put("/like/:postId", authenticateToken, likeAPost);
router.put("/unlike/:postId", authenticateToken, unlikeAPost);
router.get("/liked-posts/:userId", authenticateToken, getUsersLikedPosts);

export default router;
