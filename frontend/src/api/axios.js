import axios from "axios";

const Authorization = (localStorage.getItem('token') ? `jwt ${localStorage.getItem('token')}`: '');//토큰이 없을 때는 헤더에 토큰X
const URL = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
        "Authorization": Authorization
    }
})

export default URL;