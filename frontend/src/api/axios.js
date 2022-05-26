import axios from "axios";

const URL = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
        "Authorization": (localStorage.getItem('token') ? `jwt ${localStorage.getItem('token')}`: '')//토큰이 없을 때는 헤더에 토큰X
    }
})

export default URL;