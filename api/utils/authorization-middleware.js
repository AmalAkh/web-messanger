const ApiError = require("./api-error");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("./../utils/jwt-secret-key");

async function authorizationMiddleware(req,res,next)
{
    if(!req.headers["authorization"])
    {
        res.appendHeader("Content-Type", "text/json");
        res.status = 401;
        res.send(new ApiError("empty_auth_token", "Empty authorization token", "Empty authorization token"));
        return;
    }
    try
    {
        const data = await jwt.verify(req.headers["authorization"], jwtSecretKey);
        res.locals.userId = data.userId;
        next();
    }catch(err)
    {
        res.appendHeader("Content-Type", "text/json");
        res.status = 401;
        res.send(new ApiError("invalid_auth_token", "Invalid authorization token", "Invalid authorization token"));
    }
    
    
}
module.exports = authorizationMiddleware;