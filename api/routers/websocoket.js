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


router.get("/ticket", authorizationMiddleware, (req,res)=>
{
    const ticketToken = jwt.sign({userId:res.locals.userId}, jwtSecretKey, {expiresIn:30});
    return ticketToken;
    
})