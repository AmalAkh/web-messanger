import avatarPlaceholder from "./../../assets/user.png";
import host from "./host";


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
    return `${host}users/avatars/${image}`;
}
