var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
	
  res.render('index', { title: 'Express' });
});

router.route("/list").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
    var db = req.con;
    var data = "";
    var count=req.count;
    console.log("count="+count);
    function getNowTime(){
    var timeDate= new Date();
    var tMonth = (timeDate.getMonth()+1) > 9 ? (timeDate.getMonth()+1) : '0'+(timeDate.getMonth()+1);
    var tDate = timeDate.getDate() > 9 ? timeDate.getDate() : '0'+timeDate.getDate();
    var tHours = timeDate.getHours() > 9 ? timeDate.getHours() : '0'+timeDate.getHours();
    var tMinutes = timeDate.getMinutes() > 9 ? timeDate.getMinutes() : '0'+timeDate.getMinutes();
    var tSeconds = timeDate.getSeconds() > 9 ? timeDate.getSeconds() : '0'+timeDate.getSeconds();
    return timeDate= timeDate.getFullYear()+'/'+ tMonth +'/'+ tDate +' '+ tHours +':'+ tMinutes +':'+ tSeconds;
    }
    var sql = {
        time:getNowTime(),
        IP:req.connection.remoteAddress,
        ID:req.headers['user-agent']
    };
    db.query('INSERT INTO test SET ?', sql, function(err, rows) {
        if (err) {
            console.log("寫入失敗");
        }
    });
    db.query('SELECT * FROM test', function(err, rows) {
        if (err) {
            console.log(err);
        }
        
        var data = rows;

        // use index.ejs
        res.render('list', { title: 'Account Information', data: data,count: count});
    });

});
module.exports = router;
