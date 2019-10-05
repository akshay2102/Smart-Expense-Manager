var express 		= require('express'),
	app 			= express(),
	bodyParser 		= require('body-parser'),
	mongoose		= require('mongoose'),
	flash 			= require('connect-flash'),
	methodOverride 	= require('method-override'),
	session 		= require('express-session'),
	passport 		= require('passport'),
	mysql 			= require('mysql');




var login = require('./routes/loginroutes');
// var bodyParser = require('body-parser');
// var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();
//Initial Setup
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
var	con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "expense_manager"
});
con.connect(function(err){
	if (err) throw err;
 	console.log("Connected!");
});
//route to handle user registration
app.get('/',function(req, res) {
	res.render('login.ejs');
});
app.get('/dashboard', function(req, res){
	res.render('dashboard.ejs');
});
app.get('/profile', function(req, res){
	res.render('profile');
});
app.post('/register',login.register);
app.post('/login',login.login);
app.use('/api', router);
app.listen(3000);
