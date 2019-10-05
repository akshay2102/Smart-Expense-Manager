var express     = require('express'),
  app       = express(),
  bodyParser    = require('body-parser'),
  mongoose    = require('mongoose'),
  flash       = require('connect-flash'),
  methodOverride  = require('method-override'),
  session     = require('express-session'),
  passport    = require('passport'),
  mysql       = require('mysql'),
  sessionStorage  = require('sessionstorage');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "expense_manager"
});

connection.connect(function(err){
  if (err) throw err;
  console.log("Connected!");
});

module.exports.register = function(req,res){
  // console.log("req",req.body);
  // var today = new Date();
  var user={
    "name":req.body.name,
    "u_id":req.body.u_id,
    "password":req.body.password,
    "salary":req.body.salary,
    "number":req.body.mobile
  }
  connection.query('INSERT INTO user SET ?',user, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "success":"user registered sucessfully"
        });
  }
  });
}

module.exports.login = function(req,res){
  var u_id= req.body.u_id;
  var password = req.body.password;
  connection.query('SELECT * FROM user WHERE u_id = ?',[u_id], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    if(results.length >0){
      if(results[0].password == password){
        sessionStorage.setItem('loggedin_user',u_id);
        res.redirect("/dashboard");
      }
      else{
        res.redirect("/");
      }
    }
    else{
      res.redirect("/");
    }
  }
  });
}

