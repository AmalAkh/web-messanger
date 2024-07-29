import axios from "axios";

export default function getUserInfo(id)
{
    if(!id)
    {
        return axios.get("http://localhost:8000/users/info",{headers:{'Authorization':localStorage.getItem("jwt")}});
    }
    else
    {
        return axios.get(`http://localhost:8000/users/info/${id}`,{headers:{'Authorization':localStorage.getItem("jwt")}});

    }
}
