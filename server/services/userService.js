import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';

const signupUserService = async (userData) => {
    const { name, email, username, password } = userData;
    
    try {
      // Check for existing user
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        throw new Error('User already exists in database');
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
      throw new Error('Failed to sign up user: ' + error.message);
    }
  };
  
export {
    signupUserService
  };