const express = require("express");
const cors = require("cors");
const path = require("path");
const users = require("./routers/users");
const chats = require("./routers/chats");
const websocket = require("./routers/websocket");
const wsServer = require("./ws/ws-server");
const websocketAuth = require("./utils/websocket-auth");

const querystring = require('node:querystring'); 



 


const authorizationMiddleware = require("./utils/authorization-middleware");


 

const app = express();



let corsOptions =  
{
    origin:"*",
    optionsSuccessStatus: 200
}



app.use("/users", cors(corsOptions) , users);
app.use("/chats", cors(corsOptions) , chats);
app.use("/websocket", cors(corsOptions) , websocket);
app.use(express.static("../dist/"))
app.get("/*",cors(corsOptions), (req,res)=>{res.sendFile(path.resolve("../dist/index.html"))})







let server = app.listen(8000);

server.on("upgrade",async (req, socket, head)=>
    {
        
        let userId;
        try
        {
            userId = await websocketAuth( querystring.decode(req.url.split("?")[1])["ticket"]);
        }catch(err)
        {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            
            socket.destroy();
            return;
            
        }

 
        wsServer.handleUpgrade(req, socket, head, (ws)=>
        {
            wsServer.emit("connection", ws, req , userId);//req.headers["userid"]
        })
        
    })
