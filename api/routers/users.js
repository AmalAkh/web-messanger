const express = require("express");
const bcrypt = require("bcrypt");


const  { v4 }  = require("uuid");
const ApiError = require("./../utils/api-error");
const setupDBConnection = require("./../utils/setup-db-connection");




const router = express.Router();
const jsonParser = express.json();


router.post("/new",jsonParser, async (req, res)=>
{
    
    const pool = setupDBConnection();
    if(req.body.nickname.length > 16)
    {
        res.appendHeader("Content-Type", "text/json");
        res.statusCode = 400;
        res.send(new ApiError("nickname_length_long", "Nickname is too long", "Nickname is too long"));
        return ;
    }
    if(!(/[a-z0-9A-Z\(\)\!.\{\}]+@[a-z0-9]+\.[a-z]{2,3}/.test(req.body.email)))
    {
        res.appendHeader("Content-Type", "text/json");
        res.statusCode = 400;
        res.send(new ApiError("invalid_email", "Invalid email", "Invalid email"));
        return ;
    }

    let salt = await bcrypt.genSalt(10);

    let hashed_password = await bcrypt.hash(req.body.password, salt);

    //let hashed_password = 
    try
    {
        await pool.query("INSERT INTO users VALUES(?, ?, ?, ?, ?, DEFAULT)", [req.body.name, req.body.nickname, req.body.email, hashed_password, v4()]);
        res.sendStatus(200);
        //res.send(hashed_password);
        
    }catch(err)
    {
        res.statusCode = 400;
        res.appendHeader("Content-Type", "text/json");
        if(err.code == "ER_DUP_ENTRY")
        {
            res.send(new ApiError("user_exists", "User with this nickname or email already exists", err.sqlMessage));
           
        }else if(err.code == "ER_BAD_NULL_ERROR")
        {
            
            res.send(new ApiError("incomplete_data", "Incomplete data", err.sqlMessage));
            

        }else
        {
            console.log(err);
            res.sendStatus(400);
        }
    }
    
    
    

}); 

router.post("/:userid", async(req,res)=>
{

    const pool = setupDBConnection();

    const [rows, fields] = await pool.query("UPDATE users SET confirmed=1 WHERE id=?", [req.params.userid]);
    if(rows.affectedRows == 0)
    {
        res.statusCode = 400;
        res.send("Error confirming your account");

    }
    res.send("Your account was confirmed");
})

module.exports = router;