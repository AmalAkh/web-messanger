const express = require("express");
const  { v4 }  = require("uuid");

const authorizationMiddleware = require("./../utils/authorization-middleware");
const setupDBConnection = require("./../utils/setup-db-connection");
const ApiError = require("../utils/api-error");


const router = express.Router();

const jsonParser = express.json();

router.post("/new",authorizationMiddleware, jsonParser, async(req,res)=>
{
    const pool = setupDBConnection();

    
    const chatId = v4();


    const userExistRequestResult = await  pool.query("SELECT id FROM users WHERE nickname = ?", [req.body.nickname]);
    if(userExistRequestResult[0].length == 0)
    {
        res.statusCode = 400;
        res.append("Content-Type", "application/json");
        res.send(new ApiError("user_not_exist", "User with such nickname does not exist",  "User with such nickname does not exist"));
        return;
    }
    let secondUserId = userExistRequestResult[0][0].id;
    const chatExistRequestResult = await  pool.query("SELECT EXISTS(SELECT id FROM chats WHERE (user1id = ? AND user2id = ?) OR (user1id = ? AND user2id = ?)) AS exts", [res.locals.userId, secondUserId,secondUserId,res.locals.userId]);
    if(chatExistRequestResult[0][0].exts == 1)
    {
        res.statusCode = 400;
        res.append("Content-Type", "application/json");
        res.send(new ApiError("chat_already_not_exist", "Chat with this user already exists",  "Chat with this user already exists"));
        return;
    }


    await  pool.query("INSERT INTO chats VALUES(?, ?, ?)", [chatId, res.locals.userId, secondUserId]);


    res.append("Content-Type", "text/plain");
    res.send(chatId);
})
router.get("/",authorizationMiddleware, async(req,res)=>
{
        const pool = setupDBConnection();
        console.log(res.locals.userId);
        const [rows, _] = await pool.query("SELECT  id, IF(user1id = ?, user2id, user1id) AS userid, (SELECT name FROM users WHERE id = userId) as userName FROM chats  WHERE (user1id = ? OR user2id = ?)",[res.locals.userId, res.locals.userId,res.locals.userId]);
        
        res.send(rows);
        
});

router.delete("/:id",authorizationMiddleware, async (req, res)=>
{
    const pool = setupDBConnection();

    const result = await  pool.query("DELETE FROM chats WHERE id=?", [req.params.id]);
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
    const pool = setupDBConnection();
    
    const [rows, _] = await pool.query("SELECT text, date, id, (userid = ?) as isLocal FROM messages WHERE chatid = ? ORDER BY DATE DESC LIMIT 10 OFFSET ?", [res.locals.userId, req.params.id, Number(req.params.offset)]);

    
    res.send(rows.map((message)=>
    {
        return {...message, isLocal:message.isLocal == 1};
    }));
    
});




module.exports = router;