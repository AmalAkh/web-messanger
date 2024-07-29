import avatarPlaceholder from "./../../assets/user.png";
export default function getAvatar(image)
{
   
    if(!image)
    {
        return avatarPlaceholder;
    }
    if(image.includes("base"))
    {
        return image
    }
    return `http://localhost:8000/users/avatars/${image}`;
}
