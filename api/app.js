const express = require("express");
const cors = require("cors");

const users = require("./routers/users");
const chats = require("./routers/chats");


const app = express();


let corsOptions = 
{
    origin:"http://localhost:5173",
    optionsSuccessStatus: 200
}

app.get("/", (req, res)=>
{
    res.send("test");
});
app.use("/users", cors(corsOptions) , users);
app.use("/chats", cors(corsOptions) , chats);


app.listen(8000);