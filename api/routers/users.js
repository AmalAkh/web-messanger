const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  { v4 }  = require("uuid");
const path = require("path");


const ApiError = require("./../utils/api-error");
const pool = require("./../utils/setup-db-connection");
const jwtSecretKey = require("./../utils/jwt-secret-key");
const authorizationMiddleware = require("./../utils/authorization-middleware");
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      
      cb(null, path.resolve("files"))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + v4();
      cb(null, file.fieldname + '-' + uniqueSuffix+"."+file.mimetype.split("/")[1]);
    }
  })
  
const upload = multer({ storage: storage })

//to do : implement check for existance of user for authorizartion middleware

const router = express.Router();
const jsonParser = express.json();


router.post("/new",jsonParser, async (req, res)=>
{
    
   
    
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
        await pool.query("INSERT INTO users VALUES(?, ?, ?, ?, ?, DEFAULT, DEFAULT,DEFAULT)", [req.body.name, req.body.nickname, req.body.email, hashed_password, v4()]);
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
        /*res.appendHeader("Content-Type", "text/json");
        res.statusCode = 401;
        res.send(new ApiError("user_not_confirmed", "User account is not confirmed", "User account is not confirmed"));
        return;*/
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

router.get("/:id/status/",authorizationMiddleware, async (req,res)=>
{
   

    const [rows, _] = await pool.query("SELECT status FROM users WHERE id = ?", [req.params.id]);
    if(rows.length !=0)
    {
        res.send(rows[0].status);
        return;
    }
    res.send(new ApiError("user_not_found", "User was not found", "User was not found"));
});
router.get("/info",authorizationMiddleware, async (req,res)=>
{
       
    const [rows, _] = await pool.query("SELECT name,nickname, avatar  FROM users WHERE id=?", [res.locals.userId]);
    if(rows.length == 0)
    {
        res.send(new ApiError("user_not_found", "User was not found", "User was not found"));
        return;
    }
    res.send(rows[0]);
});

router.get("/info/:userId", async (req,res)=>
{
           
    const [rows, _] = await pool.query("SELECT name,nickname, avatar  FROM users WHERE id=?", [req.params.userId]);
    if(rows.length == 0)
    {
        res.send(new ApiError("user_not_found", "User was not found", "User was not found"));
        return;
    }
    res.send(rows[0]);
});

router.put("/info/update",authorizationMiddleware,  async(req,res)=>
{
    
    multer({storage}).single("avatar")(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          res.statusCode = 400;
          res.send(new ApiError("file_upload_err", "Error while uploading a file", "Error while uploading a file"))
          return;
        } else if (err) {
            res.statusCode = 400;
            res.send(new ApiError("file_upload_err", "Error while uploading a file", "Error while uploading a file"))
            return;
        } 
        if(!req.body.name || !req.body.nickname )
        {
            res.statusCode = 400;
             
            res.send(new ApiError("empty_field", "One of the fields is empty", "One of the fields is empty"))
            return;
        }    
        //console.log(req.body.nickname)
        const [rows, _] = await pool.query("SELECT * FROM users WHERE nickname=? AND id != ?", [req.body.nickname, res.locals.userId]);
        if(rows.length > 0) 
        {
            res.send(new ApiError("user_exists", "User with this nickname already exists","this nickname already exists"));
            return;
        }   
        
        if(req.file)
        {
            await pool.query("UPDATE users SET name=?, nickname=?, avatar=? WHERE id=?", [req.body.name,req.body.nickname,req.file.filename, res.locals.userId]);
            res.send(req.file.filename);
            
        }else
        {
            if(Boolean(req.body.removeAvatar))
            {
                await pool.query("UPDATE users SET name=?, nickname=?, avatar=null WHERE id=?", [req.body.name,req.body.nickname, res.locals.userId]);

            }else
            {
                await pool.query("UPDATE users SET name=?, nickname=? WHERE id=?", [req.body.name,req.body.nickname, res.locals.userId]);

            }
            
            res.send(null);
        }
        
        
    
        
      })
    
})
router.get("/avatars/:name", (req,res)=>
{
    res.sendFile(path.resolve("files",req.params.name));
})

module.exports = router;