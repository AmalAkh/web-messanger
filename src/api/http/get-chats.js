import axios from "axios";


export default async function getChats()
{
    
    
    return axios.get(`/chats/`,{headers:{'Authorization':localStorage.getItem("jwt")}});
    
} 