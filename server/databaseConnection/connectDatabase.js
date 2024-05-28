import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect ( process.env.DB_CONNECTION_LINK ,{
        });
        console.log(`Database Connection successful to host: ${connection.connection.host}`);
    }
    catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
}
export default connectDB;