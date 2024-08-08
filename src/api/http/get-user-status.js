import axios from "axios"
export default function getUserStatus(userId)
{
    return axios.get(`/users/${userId}/status`,{headers:{'Authorization':localStorage.getItem("jwt")}})
}