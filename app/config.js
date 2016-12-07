var mysql = require('mysql');
var connection = mysql.createConnection({
    connectionLimit : 100, //focus it
    host : 'sql9.freemysqlhosting.net',
    user : 'sql9148257',
    password : 'HSUYwSaUGY',
    database : 'sql9148257'
});

module.exports = connection;