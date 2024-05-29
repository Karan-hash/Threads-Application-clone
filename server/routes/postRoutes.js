import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  createPost,
  getPostById,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  repostPost
} from "../controllers/postController.js";

const router = express.Router();
router.get("/feed", protectRoute, getFeedPosts);
router.post("/createPost", protectRoute, createPost);
router.get("/:id", getPostById);
router.get("/user/:username", getUserPosts);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.post('/repost/:postId', protectRoute, repostPost);
export default router;
