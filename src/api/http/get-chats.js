import axios from "axios";
export default async function getChats()
{
    return axios.get("http://localhost:8000/chats/",{headers:{'Authorization':localStorage.getItem("jwt")}});
    
} 