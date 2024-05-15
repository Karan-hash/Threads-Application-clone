import express from 'express';
import generateTokenAndSetCookie from '../utils/helper.js';
import { signupUserService } from '../services/userService.js';
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
      }
      else {
        res.status(400).json({ error: "Invalid user data" });
      }
    } catch (error) {
      console.error('Error signing up user:', error);
      res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
    }
  };
  
export {
    signupUser
};
