const express = require("express");

const users = require("./routers/users");

const app = express();




app.get("/", (req, res)=>
{
    res.send("test");
});
app.use("/users",users);

app.listen(8000);