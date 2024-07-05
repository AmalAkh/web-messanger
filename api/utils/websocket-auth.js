const jwt = require("jsonwebtoken");
const jwtSecretKey = require("./jwt-secret-key");
/**  Authantification for websocket 
 * @return {String} user id
*/
async function websocketAuth(jsonwebtoken)
{
    if(!jsonwebtoken)
    {
        throw new Error("Empty auth token");
    }
   
    const data = await jwt.verify(jsonwebtoken, jwtSecretKey);
    if(data.type != "websocket")
    {
        throw new Error();
    }
    return data.userId;
            
    
}

module.exports = websocketAuth;