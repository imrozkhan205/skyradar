import dotenv from "dotenv"; 
import express from "express";
import cors from "cors";
dotenv.config();
import flightRoutes from "./routes/flightRoutes.js"

const PORT= process.env.PORT;
const app = express();
app.use(cors());
app.use('/api/flights', flightRoutes)
app.use(express.json());



app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));

