import axios from "axios"
export default function registerNewUser(name,nickname, email, password)
{

    return axios.post("/users/new", {name:name,password:password, nickname:nickname, email:email})
}