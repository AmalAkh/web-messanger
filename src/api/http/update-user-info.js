import axios from "axios";
export default function updateUserInfo(formData)
{
    return axios.put("/users/info/update", formData, {headers:{'Authorization':localStorage.getItem("jwt")}});
}