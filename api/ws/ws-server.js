/** @module WSserver 
 * @description exports WebSocketServer to process socket connections and messages 
 */
const ws = require("ws");

const setupDBConnection = require("../utils/setup-db-connection");
const  { v4 }  = require("uuid");

const wss = new ws.WebSocketServer({port:8080});


/**existing connections grouped by user id*/
let connections = {};

 
wss.on("connection", (ws, req, userId)=>
{
    if(connections[userId])
    {
        connections[userId].push(ws);
    }else
    {
        connections[userId] = [ws];
    } 
    ws.on("close", ()=>
    {
        if(connections[userId] != undefined)
        {
            connections[userId].splice(connections[userId].indexOf(ws),0);
            if(connections[userId].length = [])
            {
                delete connections[userId];
            }
        }
    });
    ws.on("message", async (data)=>
    {
        try 
        {
            let messangerRequest = JSON.parse(data); 
            if(messangerRequest.type == "new_msg")
            {
                createNewMessage(messangerRequest, userId);
                    
            }else if(messangerRequest.type == "see_msg")
            {
                seeMessage(messangerRequest.data.senderId,messangerRequest.data.id);
            }
        }catch(err)
        { 
            console.log(err);
        } 
    })
})

/**
 * Creates new message and sends it
 * @param {Object} messangerRequest request
 * @param {String} senderId sender id
 * 
 */
async function createNewMessage(messangerRequest, senderId)
{
    const pool = setupDBConnection();
  
    let messageId  = v4();
    const date = new Date();
    let messageDate = `${date.getUTCFullYear()}.${date.getUTCMonth()+1}.${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`; 
    await pool.query("INSERT INTO messages VALUES(?, ?, ?, ?, ?, DEFAULT )", [messangerRequest.data.text,messageDate, messangerRequest.data.chatId, senderId, messageId ])
    

    let responseMessage = {type:"new_msg", data:{text:messangerRequest.data.text, date:messageDate,files:[], chatId:messangerRequest.data.chatId, id:messageId, seen:false}}
    sendMessageToAll(messangerRequest.data.userId, {...responseMessage, data:{...responseMessage.data,isLocal:false}});
    sendMessageToAll(senderId,{...responseMessage, data:{...responseMessage.data,isLocal:true}});

}
/**
 * Updates message as seen
 * @param {String} senderId id of sender of the message
 * @param {String} messageId sender id
 * 
 */
async function seeMessage(senderId,messageId)
{   
    
    const pool = setupDBConnection();
  
    await pool.query("UPDATE messages SET seen = 1 WHERE id = ? ", [messageId ]);
    sendMessageToAll(senderId,{type:"see_msg", data:{id:messageId}});

}
/** Sends message through websocket to all connected sockets associated with user id 
 * @param {String} userId user id
 * @param {Object} message request message
*/
function sendMessageToAll(userId, message)
{
    if(connections[userId]) 
    {
        for(let socket of connections[userId])
        {
            socket.send(JSON.stringify(message));
        }
    }
}

module.exports = wss;

