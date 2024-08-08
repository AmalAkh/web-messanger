import axios from "axios"
import host from "./host";

export default function createNewChat(nickname)
{
    return axios.post(`/chats/new`, {nickname:nickname}, {headers:{'Authorization':localStorage.getItem("jwt")}})
    
}
