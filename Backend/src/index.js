import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({path: ['.env.local', '.env']});


connectDB()
.then(() => {
    console.log("Database connected successfully.");
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});