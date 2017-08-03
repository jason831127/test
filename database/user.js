var mysql = require('mysql');
var DB_NAME = 'demo_nodejs';

var pool  = mysql.createPool({
    host     : 'localhost/phpmyadmin',
    user     : 'wei',
    password : 'wei123'
});