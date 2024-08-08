import axios from "axios";
import host from "./host";

export default function getUserInfo(id)
{
    if(!id)
    {
        return axios.get(`/users/info`,{headers:{'Authorization':localStorage.getItem("jwt")}});
    }
    else
    {
        return axios.get(`/users/info/${id}`,{headers:{'Authorization':localStorage.getItem("jwt")}});

    }
}
