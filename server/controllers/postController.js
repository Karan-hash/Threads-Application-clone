import express from "express";
import generateTokenAndSetCookie from "../utils/helper.js";
import {
  createPostService,
  getPostByIdService,
  deletePostService,
  likeUnlikePostService,
  replyToPostService,
  getFeedPostsService,
  getUserPostsService,
  repostService
} from "../services/postService.js";
const createPost = async (req, res) => {
  const { body, user } = req;

  try {
    const newPost = await createPostService(body, user._id);
    res.status(201).json(newPost);
  } catch (error) {
    let statusCode = 500;
    if (error.message.includes("User not found")) {
      statusCode = 404;
    } else if (
      error.message.includes("Unauthorized to create post") ||
      error.message.includes("Text must be less than")
    ) {
      statusCode = 400;
    }
    res.status(statusCode).json({ error: error.message });
    console.log("Error in createPostController:", error);
  }
};
const getPostById = async (req, res) => {
  try {
    const Id = req.params.id;
    const post = await getPostByIdService(Id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const result = await deletePostService(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    const statusCode =
      error.message === "Post not found"
        ? 404
        : error.message === "Unauthorized to delete post"
        ? 401
        : 500;
    console.error("Error in deletePost: ", error.message);
    res.status(statusCode).json({ error: error.message });
  }
};
const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const result = await likeUnlikePostService(postId, userId);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message === "Post not found" ? 404 : 500;
    console.error("Error in likeUnlikePost: ", error.message);
    res.status(statusCode).json({ error: error.message });
  }
};
const replyToPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    const reply = await replyToPostService(
      postId,
      userId,
      text,
      userProfilePic,
      username
    );
    res.status(200).json(reply);
  } catch (error) {
    const statusCode =
      error.message === "Text field is required"
        ? 400
        : error.message === "Post not found"
        ? 404
        : 500;
    console.error("Error in replyToPost: ", error.message);
    res.status(statusCode).json({ error: error.message });
  }
};
const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const feedPosts = await getFeedPostsService(userId);

    res.status(200).json(feedPosts);
  } catch (error) {
    const statusCode = error.message === "User not found" ? 404 : 500;
    console.error("Error in getFeedPosts: ", error.message);
    res.status(statusCode).json({ error: error.message });
  }
};
const getUserPosts = async(req, res) => {
  const { username } = req.params;
  try {
    const posts = await getUserPostsService(username);
    res.status(200).json(posts);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}
const repostPost = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have middleware to set req.user
    const { postId } = req.params;

    const repostedPost = await repostService(userId, postId);

    res.status(201).json(repostedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export {
  createPost,
  getPostById,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  repostPost
};
