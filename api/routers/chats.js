const express = require("express");
const  { v4 }  = require("uuid");

const authorizationMiddleware = require("./../utils/authorization-middleware");
const pool = require("./../utils/setup-db-connection");
const ApiError = require("../utils/api-error");


const router = express.Router();

const jsonParser = express.json();

router.post("/new",authorizationMiddleware, jsonParser, async(req,res)=>
{
   

    
    const chatId = v4();


    const userExistRequestResult = await  pool.query("SELECT name,avatar, id FROM users WHERE nickname = ?", [req.body.nickname]);
    if(userExistRequestResult[0].length == 0)
    {
        res.statusCode = 400;
        res.append("Content-Type", "application/json");
        res.send(new ApiError("user_not_exist", "User with such nickname does not exist",  "User with such nickname does not exist"));
        return;
    }
    let secondUserId = userExistRequestResult[0][0].id;
    if(secondUserId == res.locals.userId)
    {
        res.statusCode = 400;
        res.send(new ApiError("chat_with_yourself", "You cannot create chat with your self",  "You cannot create chat with your self"))
        return;
    }
    const chatExistRequestResult = await  pool.query("SELECT EXISTS(SELECT id FROM chats WHERE (user1id = ? AND user2id = ?) OR (user1id = ? AND user2id = ?)) AS exts", [res.locals.userId, secondUserId,secondUserId,res.locals.userId]);
    if(chatExistRequestResult[0][0].exts == 1)
    {
        res.statusCode = 400;
        res.append("Content-Type", "application/json");
        res.send(new ApiError("chat_already_exist", "Chat with this user already exists",  "Chat with this user already exists"));
        return;
    }


    await  pool.query("INSERT INTO chats VALUES(?, ?, ?,DEFAULT)", [chatId, res.locals.userId, secondUserId]);


    res.append("Content-Type", "text/plain");
    res.send({name:userExistRequestResult[0][0].name, nickname:req.body.nickname, avatar:userExistRequestResult[0][0].avatar,userId:secondUserId,id:chatId});
})
router.get("/",authorizationMiddleware, async(req,res)=>
{
       
       
        const [rows, _] = await pool.query("SELECT  date,id,id as currentChatId, IF(user1id = ?, user2id, user1id) AS userId, (SELECT avatar FROM users WHERE id=userId) as avatar, (SELECT name FROM users WHERE id = userId) as userName, (SELECT COUNT(*) FROM messages WHERE chatid=currentChatId AND seen=0 AND userid!=?) as unseenMessagesCount, (SELECT text FROM messages WHERE chatid=currentChatId ORDER BY date DESC LIMIT 1 ) as lastMessageText,(SELECT date FROM messages WHERE chatid=currentChatId ORDER BY date DESC LIMIT 1 ) as lastMessageDate FROM chats  WHERE (user1id = ? OR user2id = ?)",[res.locals.userId,res.locals.userId, res.locals.userId,res.locals.userId]);
        
        res.send(rows);
        
});

router.delete("/:id",authorizationMiddleware, async (req, res)=>
{
   
    console.log(req.params.id);
    const result = await  pool.query("DELETE FROM chats WHERE id=? AND (user1id = ? OR user2id = ?)", [req.params.id, res.locals.userId, res.locals.userId]);
    console.log(req.params.id);
    if(result[0].affectedRows == 0)
    {
        res.statusCode = 400;
        res.append("Content-Type", "application/json");
        res.send(new ApiError("chat_not_exist", "Chat does not exist", "Chat does not exist"));
        return;
    }

    res.send(req.params.id);

    
})

router.get("/:id/messages/:offset", authorizationMiddleware, async(req,res)=>
{
   
    
    const [rows, _] = await pool.query("SELECT text, date, id,seen, (userid = ?) as isLocal FROM messages WHERE chatid = ? ORDER BY DATE DESC LIMIT 20 OFFSET ?", [res.locals.userId, req.params.id, Number(req.params.offset)]);

    
    res.send(rows.reverse().map((message)=>
    {
        return {...message, isLocal:message.isLocal == 1, seen:message.seen == 1};
    }));
    
});
router.put(":id/see", authorizationMiddleware, async(req,res)=>
{
   
    await pool.query("UPDATE messages SET seen=1 WHERE id=?", [req.params.id]);
    res.status(200);

});




module.exports = router;