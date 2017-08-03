var express = require('express'),http = require('http');
var app = express()
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var routes = require('./routes/index');
var users = require('./routes/users');
var mysql = require("mysql");
server.listen(80);
var con = mysql.createConnection({
    host: "localhost",
    user: "wei",
    password: "wei123",
    database: "test"
});
var redis = require('redis'),
    RDS_PORT = 6379,        //端口号
    RDS_HOST = '127.0.1.1',    //服务器IP
    RDS_PWD = 'porschev',
    RDS_OPTS = {auth_pass:RDS_PWD},            //设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
    client.on('ready',function(res){
    client.set('count', 0);
    console.log('ready');    
});
 app.get('/', function (req, res) {
   res.sendfile(__dirname + '/list.html');
 });
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        client.decr('count');
        client.get('count', function(err, reply) {
        console.log(reply);
    });
   });
  
});
con.connect(function(err) {
    if (err) {
        console.log('connecting error');
        return;
    }
    console.log('connecting success');
});
app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    console.log("使用者連線");
    client.incr('count');
    client.get('count', function(err, reply) {
        req.con = con;
        req.count = reply;
        console.log(req.count);
        next();
    });
  
});
app.use('/', routes);  // 即为为路径 / 设置路由
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
