import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://skyradar-0ozt.onrender.com/api/",
    withCredentials: true, // send cookies with the request
})

