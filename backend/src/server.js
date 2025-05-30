import dotenv from "dotenv"; 
import express from "express";
import cors from "cors";
dotenv.config();
import flightRoutes from "./routes/flightRoutes.js"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./libs/db.js";

const PORT= process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/flights', flightRoutes)
app.use('/api/auth', authRoutes)


connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

