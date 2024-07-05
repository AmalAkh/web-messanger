/** @module WSserver 
 * @description exports WebSocketServer to process socket connections and messages 
 */
const ws = require("ws");

const setupDBConnection = require("../utils/setup-db-connection");
const  { v4 }  = require("uuid");
/**/
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
        connections[userId].splice(connections[userId].indexOf(ws),0);
        if(connections[userId].length = [])
        {
            delete connections[userId];
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
    let messageDate = `${date.getUTCFullYear()}.${date.getUTCMonth()+1}.${date.getUTCDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`; 
    await pool.query("INSERT INTO messages VALUES(?, ?, ?, ?, ?, DEFAULT )", [messangerRequest.data.message,messageDate, messangerRequest.data.chatId, messangerRequest.data.userId, messageId ])
    

    let responseMessage = {type:"new_msg", data:{text:messangerRequest.data.message, date:messageDate,files:[], id:messageId}}
    sendMessageToAll(messangerRequest.data.userId, {...responseMessage, isLocal:false});
    sendMessageToAll(senderId, {...responseMessage, isLocal:true});

}
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

