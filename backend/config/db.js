import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://mongodb:27017/Library-Management";
        await mongoose.connect(mongoUri);
        console.log("Db connected successfully to:", mongoUri.includes("@") ? mongoUri.split("@")[1] : mongoUri);
    } catch (error) {
        console.error("Failed to connect db:", error.message || error);    
    }
}