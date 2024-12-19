const mysql = require("mysql2/promise");

function setupDBConnection()
{
    console.log(process.env.DB_HOST);
    return mysql.createPool(
        { 
            user:"root",
            host:process.env.DB_HOST ? process.env.DB_HOST : "localhost",
            password:"643a01ce5daa7c6e3f",
            database:"web-chat-app-db",
            maxIdle:50
            
           
        });
    
}
module.exports = setupDBConnection();