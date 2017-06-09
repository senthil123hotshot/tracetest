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
app.post("/register",function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  connection.query("INSERT INTO userinfo (`username`, `password`) VALUES ('" + username + "','"+password+"')", function(err){
    if(err){
      res.send("Registeration failure");
    }
    else{
      res.send("Registeration Success");
    }});
});
app.post("/login",function(req,res){
  //login pageload
var username=req.body.username;
 var password=req.body.password;
 console.log(username);
 connection.query('select id from userinfo where username= "'+username+'" and password="'+password+'"' ,function(err,result){
  if(result.length==0){
    res.send("Authendication failure");
  }
  else{   
     sess=req.session; 
     sess.ID=result[0].id;
     console.log(sess.ID);
     connection.query('select * from folder where id="'+sess.ID+'"',function(err,result){
      if(err){
        res.send(err);
      }
      else
      {
        res.send({success:true,message:"Login success","data":result});
      }
     });
    }
 });
});
//------------------folderrename---------------------------
app.post("/folderrename",function(req,res){
  sess=req.session;
  if(sess.ID){
 var foldernewname=req.body.foldernewname;
connection.query('UPDATE folder SET name = "'+foldernewname+'" WHERE id="'+sess.ID+'"',function(err,result){
if(err){
  res.send("Problem in Updating");
}
else{
  res.send("Folder Name updated Succesfully");
}
});
}
else{
  res.send("You Must login");
}
});
//----------------------folder creation api.-----------------------------
app.post("/folderadd",function(req,res){
sess=req.session;
if(sess.ID){
  console.log(sess.id);
var foldername=req.body.foldername;
var created=new Date();
created=created.getFullYear()+'-' + (created.getMonth()+1) + '-'+created.getDate();//prints expected format.
console.log(created);
connection.query("INSERT INTO folder (`id`, `name`,`created`) VALUES ('" + sess.ID + "', '" +foldername + "','" +created+ "')", function(err,result){
if(err){
  console.log(err);
}
else{
  res.send("Folder is added");
}
});
}
else{
  res.send("You Must Login");
}
});
app.post("/addContent",function(req,res){
  sess=req.session;
  if(sess.ID){
    var info=req.body.info;
    var link=req.body.link;
    var foldername=req.body.foldername;
  connection.query("INSERT INTO textstore (`id`, `info`,`link`,`foldername`) VALUES ('" + sess.ID + "', '" +info + "','" +link + "','"+foldername+"')", function(err){
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
//---------------------search by the keyword-------------
 app.post("/search",function(req,res){
sess=req.session;
if(sess.ID){
var keyword=req.body.keyword;
connection.query("select * from textstore where info like '%"+keyword+"%' and id="+sess.ID+"" ,function(err,result){
if(err){
  res.send(err);
  console.log(err);
}
else{
  res.send(result);
}
});
}
else{
  res.send("You Must Login");
}
 }); 
 app.get('/logout',function(req,res){
  
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.send('user logout');
    }
  });

}); 
app.listen(3000);
