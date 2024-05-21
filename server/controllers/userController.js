import express from "express";
import generateTokenAndSetCookie from "../utils/helper.js";
import {
  signupUserService,
  loginUserService,
  logoutUserService,
  followUnFollowUserService,
  updateUserService,
  getUserProfileService,
} from "../services/userService.js";
// import User from '../models/userModel.js';

const signupUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await signupUserService(userData);

    if (newUser) {
      // Generate token and set cookie after successful signup
      generateTokenAndSetCookie(newUser._id, res); // Assuming newUser is returned by userService.signupUser

      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio || "", // Include an empty string for bio if not set
        profilePic: newUser.profilePic || "", // Include an empty string for profilePic if not set
      };

      res.status(201).json(userResponse); // Send user details in the response
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error signing up user:", error);
    const statusCode =
      error.message ===
      "Failed to sign up user: User already exists in database"
        ? 409
        : 500;
    res.status(statusCode).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userData = await loginUserService(username, password);
    if (userData) {
      generateTokenAndSetCookie(userData._id, res);
      res.status(200).json(userData);
    }
  } catch (error) {
    let statusCode;
    switch (error.message) {
      case "Invalid username or password":
        statusCode = 400;
        break;
      case "Internal server error":
        statusCode = 500;
        break;
      default:
        statusCode = 500;
    }
    console.error("Error in loginUser: ", error.message);
    res.status(statusCode).json({ error: error.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    const result = await logoutUserService();
    res.cookie("jwt", "", { maxAge: 1 }); // Clearing the JWT cookie
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in logoutUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const resultMessage = await followUnFollowUserService(
      id,
      req.user._id.toString()
    );
    res.status(200).json({ message: resultMessage });
  } catch (error) {
    console.error("Error in follow and unfollow user: ", error.message);
    const statusCode =
      error.message === "You cannot follow/unfollow yourself" ||
      error.message === "User not found"
        ? 400
        : 500;
    res.status(statusCode).json({ error: error.message });
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await updateUserService(req.user._id, { id }, req.body);
    if (!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// To test this api = http://localhost:5000/api/users/profile/karan_kaushal123
const getUserProfile = async (req, res) => {
  // We will fetch user profile either with username or userId
  // Query is either username or userId
  const { query } = req.params;

  try {
    const user = await getUserProfileService(query);
    if (!user) return res.status(404).json({ error: "User not found" });
    res
      .status(200)
      .json({ message: "User profile fetched successfully", user });
  } catch (error) {
    console.error("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
};
