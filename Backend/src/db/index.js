import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const ConnectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Connected to the database!!!, Host: ${ConnectionInstance.connection.host} ${ConnectionInstance.connection.name}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

export default connectDB;