import axios from "axios";
export default async function getWebSocketTicket()
{
    return axios.get("http://localhost:8000/websocket/ticket",{headers:{'Authorization':localStorage.getItem("jwt")}});
    
} 