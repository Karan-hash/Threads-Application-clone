import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
const createPostService = async (postData, userId) => {
  const { postedBy, text, img } = postData;

  try {
    if (!postedBy || !text) {
      throw new Error("Postedby and text fields are required");
    }

    const user = await User.findById(postedBy);
    if (!user) {
      throw new Error("User not found");
    }

    if (user._id.toString() !== userId.toString()) {
      throw new Error("Unauthorized to create post");
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      throw new Error(`Text must be less than ${maxLength} characters`);
    }

    let imgUrl = "";
    if (img) {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        imgUrl = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      postedBy,
      text,
      img: imgUrl
    });
    await newPost.save();

    return newPost;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getPostByIdService = async (Id) => {
  try {
    const post = await Post.findById(Id);
    return post;
  } catch (error) {
    throw new Error(error.message);
  }
};
const deletePostService = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (post.postedBy.toString() !== userId.toString()) {
      throw new Error("Unauthorized to delete post");
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);

    return { message: "Post deleted successfully" };
  } catch (err) {
    throw new Error(err.message);
  }
};
const likeUnlikePostService = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      return { message: "Post unliked successfully" };
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      return { message: "Post liked successfully" };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
const replyToPostService = async (
  postId,
  userId,
  text,
  userProfilePic,
  username
) => {
  try {
    if (!text) {
      throw new Error("Text field is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    return reply;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getFeedPostsService = async (userId) => {
  try {
    // console.log("Current User Id: ", userId);
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const following = user.following;
    // console.log("Current User following list: ", following);
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    return feedPosts;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserPostsService = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('User not found');
  }

  const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
  return posts;
};
export {
  createPostService,
  getPostByIdService,
  deletePostService,
  likeUnlikePostService,
  replyToPostService,
  getFeedPostsService,
  getUserPostsService
};
