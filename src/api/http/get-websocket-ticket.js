import axios from "axios";
import host from "./host";

export default async function getWebSocketTicket()
{
    return axios.get(`/websocket/ticket`,{headers:{'Authorization':localStorage.getItem("jwt")}});
    
} 