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


    const userExistRequestResult = await  pool.query("SELECT EXISTS(SELECT id FROM users WHERE nickname = ?) AS exts", [req.body.userId]);
    if(userExistRequestResult[0][0].exts == 0)
    {
        res.statusCode = 400;
        res.append("Content-Type", "application/json");
        res.send(new ApiError("user_not_exist", "User with such nickname does not exist",  "User with such nickname does not exist"));
        return;
    }

    const chatExistRequestResult = await  pool.query("SELECT EXISTS(SELECT id FROM chats WHERE (user1id = ? AND user2id = ?) OR (user1id = ? AND user2id = ?)) AS exts", [res.locals.userId, req.body.userId,req.body.userId,res.locals.userId]);
    if(chatExistRequestResult[0][0].exts == 0)
    {
        res.statusCode = 400;
        res.append("Content-Type", "application/json");
        res.send(new ApiError("chat_already_not_exist", "Chat with this user already exists",  "Chat with this user already exists"));
        return;
    }


    await  pool.query("INSERT INTO chats VALUES(?, ?, ?)", [chatId, res.locals.userId, req.body.userId]);


    res.append("Content-Type", "text/plain");
    res.send(chatId);
})


module.exports = router;