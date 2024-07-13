const mysql = require("mysql2/promise");

function setupDBConnection()
{
    return mysql.createPool(
        {
            user:"root",
            host:"localhost",
            password:"amal2004",
            database:"web-chat-app-db",
            idleTimeout: 6000
        });
}
module.exports = setupDBConnection;