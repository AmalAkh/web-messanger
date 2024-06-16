const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  { v4 }  = require("uuid");


const ApiError = require("./../utils/api-error");
const setupDBConnection = require("./../utils/setup-db-connection");
const jwtSecretKey = require("./../utils/jwt-secret-key");
const authorizationMiddleware = require("./../utils/authorization-middleware");




const router = express.Router();
const jsonParser = express.json();


router.post("/new",jsonParser, async (req, res)=>
{
    
    const pool = setupDBConnection();
    
    if(req.body.nickname && req.body.nickname.length > 16)
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

    
    try
    {
        await pool.query("INSERT INTO users VALUES(?, ?, ?, ?, ?, DEFAULT)", [req.body.name, req.body.nickname, req.body.email, hashed_password, v4()]);
        res.sendStatus(200);
   
        
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

router.post("/confirm/:userid", async(req,res)=>
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

router.post("/auth", jsonParser,  async (req,res)=>
{

    const pool = setupDBConnection();
    const [rows, _] = await pool.query("SELECT password, id,confirmed FROM users  WHERE email = ? OR  nickname = ?", [req.body.login, req.body.login]);
    if(rows.length == 0)
    {
        res.appendHeader("Content-Type", "text/json");
        res.statusCode = 401;
        res.send(new ApiError("user_not_exist", "User with this nickname or email does not exist", "User with this nickname or email does not exist"));
        return;
    }
    if(rows[0].confirmed != 1)
    {
        res.appendHeader("Content-Type", "text/json");
        res.statusCode = 401;
        res.send(new ApiError("user_not_confirmed", "User account is not confirmed", "User account is not confirmed"));
        return;
    }
    
    if(!(await bcrypt.compare(req.body.password, rows[0].password)))
    {
        res.appendHeader("Content-Type", "text/json");
        res.statusCode = 401;
        res.send(new ApiError("incorrect_password", "Incorrect password", "Incorrect password"));
        return;
    }
        
    res.statusCode = 200;
    res.appendHeader("Content-Type", "text/plain");
    res.send(await jwt.sign({userId:rows[0].id}, jwtSecretKey, {expiresIn:"24h"}));
})
router.delete("/remove",authorizationMiddleware, async (req, res)=>
{
    const pool = setupDBConnection();
    const [rows, fields] = await pool.query("DELETE FROM users WHERE id=?", [res.locals.userId]);
    if(rows.affectedRows == 0)
    {

        res.appendHeader("Content-Type", "text/json");
        res.statusCode = 404;
        res.send(new ApiError("user_not_found", "Account was not found ", "Account was not found"));
        return;
    }
    
    return;
});
module.exports = router;