const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI; // Store in env variables

if (!MONGODB_URI) throw new Error("MongoDB URI is missing!");

let cached = global.mongoose || { conn: null, promise: null };

async function connectToMongoDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

global.mongoose = cached;
module.exports = { connectToMongoDB };
