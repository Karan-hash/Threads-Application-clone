import express from 'express';
import dotenv from 'dotenv';
import connectDB from './databaseConnection/connectDatabase.js';


dotenv.config('.\env');
const app = express();

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})