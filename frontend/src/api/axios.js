import axios from "axios";

const URL = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `jwt ${localStorage.getItem('token')}`
    }
})

export default URL;