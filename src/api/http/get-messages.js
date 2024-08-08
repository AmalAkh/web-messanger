import axios from "axios";


/**
 * 
 * @param {String} chatId  chat id
 * @param {Number} offset offset
 * @returns {Promise}
 */
export default function getMessages(chatId, offset=0)
{
    return axios.get(`/chats/${chatId}/messages/${offset}`,{headers:{'Authorization':localStorage.getItem("jwt")}});
}