var express 		= require('express'),
	app 			= express(),
	bodyParser 		= require('body-parser'),
	mongoose		= require('mongoose'),
	flash 			= require('connect-flash'),
	methodOverride 	= require('method-override'),
	session 		= require('express-session'),
	passport 		= require('passport'),
	mysql 			= require('mysql');

//Initial Setup
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

var	con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "smart_expense_manager"
});

con.connect(function(err){
	if (err) throw err;
 	console.log("Connected!");
});