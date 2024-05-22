import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
const signupUserService = async (userData) => {
  const { name, email, username, password } = userData;

  try {
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error("User already exists in database");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    // Return the newly created user object
    return savedUser;
  } catch (error) {
    // Handle any errors (e.g., database errors, hashing errors)
    throw new Error("Failed to sign up user: " + error.message);
  }
};

const loginUserService = async (username, password) => {
  try {
    // const user = await User.findOne({ username });
    // if (!user) {
    // 	throw new Error("Invalid username or password");
    // }

    // const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // if (!isPasswordCorrect) {
    // 	throw new Error("Invalid username or password");
    // }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      throw new Error("Invalid username or password");
    }
    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    };
  } catch (error) {
    throw new Error(error.message || "Internal server error");
  }
};
const logoutUserService = async () => {
  try {
    return { message: "User logged out successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};
const followUnFollowUserService = async (userId, currentUserId) => {
  try {
    const userToModify = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToModify || !currentUser) {
      throw new Error("User not found");
    }

    if (userId === currentUserId) {
      throw new Error("You cannot follow/unfollow yourself");
    }

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId },
      });
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId },
      });
      return "User unfollowed successfully";
    } else {
      // Follow user
      await User.findByIdAndUpdate(userId, {
        $push: { followers: currentUserId },
      });
      await User.findByIdAndUpdate(currentUserId, {
        $push: { following: userId },
      });
      return "User followed successfully";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
// const updateUserService = async (userId, params, body) => {
//   try {
// 		const { name, email, username, password, bio } = body;
// 		let { profilePic } = body;

// 		let user = await User.findById(userId);
// 		if (!user) {
// 			throw new Error("User not found");
// 		}

// 		if (params.id !== userId.toString()) {
// 			throw new Error("You cannot update other user's profile");
// 		}

// 		if (password) {
// 			const salt = await bcrypt.genSalt(10);
// 			const hashedPassword = await bcrypt.hash(password, salt);
// 			user.password = hashedPassword;
// 		}

// 		if (profilePic) {
// 			if (user.profilePic) {
// 				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
// 			}

// 			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
// 			profilePic = uploadedResponse.secure_url;
// 		}

// 		user.name = name || user.name;
// 		user.email = email || user.email;
// 		user.username = username || user.username;
// 		user.profilePic = profilePic || user.profilePic;
// 		user.bio = bio || user.bio;

// 		user = await user.save();

// 		// // Find all posts that this user replied and update username and userProfilePic fields
// 		// await Post.updateMany(
// 		// 	{ "replies.userId": userId },
// 		// 	{
// 		// 		$set: {
// 		// 			"replies.$[reply].username": user.username,
// 		// 			"replies.$[reply].userProfilePic": user.profilePic,
// 		// 		},
// 		// 	},
// 		// 	{ arrayFilters: [{ "reply.userId": userId }] }
// 		// );

// 		// password should be null in response
// 		user.password = null;

// 		return user;
// 	} catch (error) {
// 		throw new Error(error.message);
// 	}
// };

const getUserProfileService = async (query) => {
  try {
    let user;

    // Query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // Query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
export {
  signupUserService,
  loginUserService,
  logoutUserService,
  followUnFollowUserService,
  // updateUserService,
  getUserProfileService,
};
