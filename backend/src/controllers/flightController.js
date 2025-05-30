import axios from "axios";

export const getNearbyFlights = async(req, res) => {
    try {
        const {lat, lon} = req.query;
        if(!lat || !lon){
            return res.status(400).json({message:"Missing lat/long params"});
        }
        const offset = 1; // 1 degree in each direcn
        const url = `https://opensky-network.org/api/states/all?lamin=${lat - offset}&lomin=${lon - offset}&lamax=${lat + offset}&lomax=${lon + offset}`;


        const response = await axios.get(url)
        res.json(response.data.states || []);
    } catch (error) {
        res.status(500).json({error:'Failed to fetch flight data'});
    }
};