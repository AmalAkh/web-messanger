const mysql = require("mysql2/promise");

function setupDBConnection()
{
    return mysql.createPool(
        { 
            user:"root",
            host:"db",
            password:"643a01ce5daa7c6e3f",
            database:"web-chat-app-db",
            maxIdle:50,
            
           
        });
}
module.exports = setupDBConnection();