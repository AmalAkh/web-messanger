export default function loginIntoApp(login, password)
{
    return axios.post("/users/auth", {login:login, password:password})
}