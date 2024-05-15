import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './databaseConnection/connectDatabase.js';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
dotenv.config('.\env');

connectDB();
const app = express();

// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());


// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})