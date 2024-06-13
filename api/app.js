const express = require("express");

const app = express();





app.get("/", (req, res)=>
{
    res.send("test");
});

app.listen(8000);