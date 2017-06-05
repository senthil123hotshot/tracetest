var express = require('express');
var request=require("request");
var mysql = require('mysql');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var sess;
//database connectivity
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'trace'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});
app.post("/login",function(req,res){
  //login pageload
var username=req.body.username;
 var password=req.body.password;
 sess=req.session; 
     sess.username=username;
 console.log(username);
 connection.query('select * from userinfo where username= "'+username+'" and password="'+password+'"' ,function(err,result){
  if(result.length==0){
    res.send("Authendication failure");
  }
  else{   
   res.send("Login Success");
    }
 });
});
app.post("/addContent",function(req,res){
  sess=req.session;
  if(sess.username){
    var info=req.body.info;
    var link=req.body.link;
    var foldername=req.body.foldername;
  connection.query("INSERT INTO textstore (`username`, `info`,`link`,`foldername`) VALUES ('" + sess.username + "', '" +info + "','" +link + "','"+foldername+"')", function(err){
if(err){
  res.send("Problem in storage");
}
else{
  res.send("data is added");
}
});
  }
  else{
    res.send("You Must Login");
  }
});
app.listen(3000);
