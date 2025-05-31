import dotenv from "dotenv"; 
import express from "express";
import cors from "cors";
dotenv.config();
import flightRoutes from "./routes/flightRoutes.js"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./libs/db.js";

const app = express();
const PORT= process.env.PORT;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send the cookies
}));
app.use(express.json());
app.use('/api/flights', flightRoutes)
app.use('/api/auth', authRoutes)


connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

