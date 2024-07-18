/** @module WSserver 
 * @description exports WebSocketServer to process socket connections and messages 
 */
const mysql = require("mysql2/promise");

const ws = require("ws");

const setupDBConnection = require("../utils/setup-db-connection");
const  { v4 }  = require("uuid");

const wss = new ws.WebSocketServer({port:8080});

const pool = setupDBConnection();

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
    setStatus(userId, "online");
    ws.on("close", ()=>
    {
        let date = new Date();
        setStatus(userId, `${date.getUTCFullYear()}.${date.getUTCMonth()+1}.${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes() >=10 ? date.getUTCMinutes() : "0"+date.getUTCMinutes()}`);
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
    
    let messageId  = v4();
    const date = new Date();
    
    let messageDate = `${date.getUTCFullYear()}.${date.getUTCMonth()+1}.${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`; 
    await pool.execute("INSERT INTO messages VALUES(?, ?, ?, ?, ?, DEFAULT )", [messangerRequest.data.text,messageDate, messangerRequest.data.chatId, senderId, messageId ])
    

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
    try
    {
        
        
        await pool.execute("UPDATE messages SET seen = 1 WHERE id = ? ", [messageId ]);
        sendMessageToAll(senderId,{type:"see_msg", data:{id:messageId}});
        
    }catch(err)
    {
        setTimeout(()=>
        {
            seeMessage(senderId, messageId);
        }, 1000);
    }
}

async function setStatus(userId, status)
{
    const [rows, _] = await pool.execute("SELECT IF(user1id = ?, user2id, user1id) as companionId FROM chats WHERE user1id = ? OR user2id = ? ", [userId,userId,userId ]);
    await pool.execute("UPDATE users SET status=? WHERE id = ?", [status, userId]);
    for(let row of rows)
    {
        sendMessageToAll(row.companionId, {type:"status-change",data:{status:status}});
    }
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

