// dGLy5BVgEbpdl3oW

// mongodb+srv://<db_username>:<db_password>@cluster0.bpfhl5d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

import mongoose from "mongoose";//It simplifies interacting with MongoDB databases by providing a schema-based approach for modeling data and automating tasks like validation and query building. 
export const connectDB = async() => {
    
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);   
    } catch (error) {
        console.log("Error in connecting to mongoDB", error);
        process.exit(1); // 1 means failure   
    }
}