var express 		= require('express'),
	app 			= express(),
	bodyParser 		= require('body-parser'),
	mongoose		= require('mongoose'),
	flash 			= require('connect-flash'),
	methodOverride 	= require('method-override'),
	session 		= require('express-session'),
	passport 		= require('passport'),
	mysql 			= require('mysql'),
	sessionStorage	= require('sessionstorage');

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

app.get('/',function(req, res) {
	res.render('login.ejs');
});
app.get('/dashboard', function(req, res){
	res.render('dashboard.ejs');
});
app.get('/expence', function(req, res){
	res.render('expence.ejs');
});
app.get('/future', function(req, res){
	res.render('future.ejs');
});


app.get('/profile', function(req, res){
	var details = {}
	var currentUser = sessionStorage.getItem('loggedin_user');
	console.log(currentUser);
	con.query('SELECT * From user WHERE u_id = ?',[currentUser], function(error,results,fields){
		console.log(results);
		data = results[0];
		name = data.name.split(' ');
		// console.log(data.number);
		details.first_name = name[0];
		details.last_name = name[1];
		details.username = data.u_id;
		details.mobile = data.number;
		details.salary = data.salary;
		console.log(details);
		res.render('profile',{details:details});
	});
});
app.post('/register',login.register);
app.post('/login',login.login);
app.post('/updateProfile',function(req, res){
	var currentUser = sessionStorage.getItem('loggedin_user');
	var full_name = req.body.fname + ' ' + req.body.lname;
	con.query('UPDATE user SET name = ?,u_id = ?,number = ?,salary = ? WHERE u_id = ?',[full_name,req.body.uname,req.body.mob,req.body.salary,sessionStorage.getItem('loggedin_user')], function(error,results,fields){
		console.log('Successfully Updated!!!!');
		sessionStorage.setItem('loggedin_user',req.body.uname);
		res.redirect('/profile');
	});
});
app.use('/api', router);
app.listen(3000);
