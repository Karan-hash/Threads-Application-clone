import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  createPost,
  getPostById,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
} from "../controllers/postController.js";

const router = express.Router();
router.get("/feed", protectRoute, getFeedPosts);
router.post("/createPost", protectRoute, createPost);
router.get("/:id", getPostById);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
export default router;
