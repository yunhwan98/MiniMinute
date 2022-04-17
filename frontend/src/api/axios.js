import axios from "axios";

const URL = axios.create({
    baseURL: "http://127.0.0.1:8000",
    //header token
})

export default URL;