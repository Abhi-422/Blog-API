import mongoose from "mongoose";

export const clearDB = async () => {
    // This ensures every test starts with a blank slate
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};
