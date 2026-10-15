import mongoose from "mongoose";

// Serverless (Vercel) me connection ko cache karte hain taaki har request pe
// naya connect na ho aur ek baar fail hone ke baad dobara try ho sake.
let connectionPromise = null;

export async function connectDatabase() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not set");
    }

    if (mongoose.connection.readyState === 1) return mongoose.connection;

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
            .then((conn) => {
                console.log("MongoDB Connected!");
                return conn;
            })
            .catch((error) => {
                // fail hone pe cache clear karo taaki next request dobara try kare
                connectionPromise = null;
                console.error("MongoDB connection failed:", error.message);
                throw error;
            });
    }

    return connectionPromise;
}
