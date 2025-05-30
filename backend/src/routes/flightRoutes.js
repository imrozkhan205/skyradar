import express from "express"
const router = express.Router()
import {getNearbyFlights} from "../controllers/flightController.js"

router.get('/', getNearbyFlights)

export default router;