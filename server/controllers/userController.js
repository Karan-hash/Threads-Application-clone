import express from "express";
import generateTokenAndSetCookie from "../utils/helper.js";
import {
  signupUserService,
  loginUserService,
  logoutUserService,
  followUnFollowUserService,
  // updateUserService,
  getUserProfileService,
  getSuggestedUsersService,
  freezeUserAccountService
} from "../services/userService.js";
import User from "../models/userModel.js";
// import User from '../models/userModel.js';
import Post from "../models/postModel.js";

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
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};
// const updateUser = async (req, res) => {
//   // const { id } = req.params;
//   // console.log("Update call : ", req.user._id, req.params);
//   // try {
//   //   const user = await updateUserService(req.user._id, req.params, req.body); // Pass id directly instead of { id }
//   //   if (!user) return res.status(400).json({ error: "User not found" });
//   //   res.status(200).json({ message: "Profile updated successfully", user });
//   // } catch (error) {
//   //   console.error("Error in updateUser: ", error.message);
//   //   res.status(500).json({ error: error.message });
//   // }
//   const { id } = req.params;
// 	try {
// 		const user = await updateUserService(req.user._id, { id }, req.body);
//     if (!user) return res.status(400).json({ error: "User not found" });
// 		res.status(200).json({ message: "Profile updated successfully", user });
// 	} catch (error) {
//     console.error("Error in updateUser: ", error.message);
// 		res.status(500).json({ error: error.message });
// 	}
// };

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
const getSuggestedUsers = async(req, res) => {
  try {
		const userId = req.user._id;
		const suggestedUsers = await getSuggestedUsersService(userId);

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
export const freezeAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await freezeUserAccountService(userId);

    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Account is already frozen') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers
};
