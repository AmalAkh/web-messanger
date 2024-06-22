const express = require("express");
const cors = require("cors");

const users = require("./routers/users");

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

app.listen(8000);