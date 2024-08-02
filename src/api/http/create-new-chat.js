import axios from "axios"
export default function createNewChat(nickname)
{
    return axios.post("http://localhost:8000/chats/new", {nickname:nickname}, {headers:{'Authorization':localStorage.getItem("jwt")}})
    
}
