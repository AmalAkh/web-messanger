/**Router for getting tickets for websocket connections 
 * @module Websocket
 *  
 */

const express = require("express");
const authorizationMiddleware = require("../utils/authorization-middleware");
const jwt = require("jsonwebtoken");
const setupDBConnection = require("../utils/setup-db-connection");
const jwtSecretKey = require("../utils/jwt-secret-key");

const router = express.Router();


router.get("/ticket", authorizationMiddleware, async (req,res)=>
{
    res.send(await jwt.sign({userId:res.locals.userId, type:"websocket"}, jwtSecretKey, {expiresIn:30}));
    
    
})
module.exports = router;