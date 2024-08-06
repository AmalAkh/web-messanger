import axios from "axios";

/**
 * 
 * @param {String} chatId 
 * @returns {Promise}
 */
export default function removeChat(chatId)
{
    console.log(chatId);
    console.log(`http://localhost:8000/chats/${chatId}`);
    return axios.delete(`http://localhost:8000/chats/${chatId}`,{headers:{"Authorization":localStorage.getItem("jwt")}});
}