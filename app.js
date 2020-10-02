var express 		= require('express'),
	app 			= express(),
	bodyParser 		= require('body-parser'),
	mongoose		= require('mongoose'),
	flash 			= require('connect-flash'),
	methodOverride 	= require('method-override'),
	session 		= require('express-session'),
	passport 		= require('passport'),
	mysql 			= require('mysql'),
	sessionStorage	= require('sessionstorage'),
	webpush 		= require('web-push'),
	path 			= require('path');

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
app.use(express.static(path.join(__dirname, "client")));
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

app.get('/login',function(req, res) {
	res.render('login.ejs');
});
app.get('/dashboard', function(req, res){
	res.render('dashboard.ejs',{freq : '', sum_expenses : '', uid: sessionStorage.getItem('loggedin_user')});
});
app.get('/expense', function(req, res){
	res.render('expense.ejs',{uid:sessionStorage.getItem('loggedin_user')});
});
app.get('/future', function(req, res){
	con.query('SELECT * FROM goals WHERE u_id = ?',[sessionStorage.getItem('loggedin_user')],function(error,results,fields){
		res.render('future.ejs',{uid:sessionStorage.getItem('loggedin_user'), results: results});
	});
});
app.post('/billDetails', function(req,res){
	var today = new Date().getDate();
	var month = new Date().getMonth();
	var days = 0
	send_uid = []
	send_days = []
	// console.log(month);
	var currentUser = sessionStorage.getItem('loggedin_user');
	con.query('SELECT * FROM expense WHERE u_id = ? AND MONTH(date) = ? AND category="Bill"  ',[currentUser, month+1], function(err, result, fields) {
		// console.log(result);
		result.forEach(function(items){
			curr_date = new Date().getDate();
			db_date = items.date.getDate();
			// console.log(curr_date);
			// console.log(db_date);
			if(curr_date<=db_date)
			{
				console.log("in if");
				days = db_date - curr_date;
			}
			else
			{
				console.log("in else");
				days = curr_date - db_date;
			}
			send_uid.push(items.title);
			send_days.push(days);
			// console.log(days);
		});
		console.log(send_uid,send_days);
		res.render('bill.ejs',{uid:sessionStorage.getItem('loggedin_user'),send_uid : send_uid, send_days : send_days});
	});
})
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
app.get("/dashboard",function(req, res){
	res.render('dashboard.ejs', {freq : '', sum_expenses : '', uid: sessionStorage.getItem('loggedin_user')});
});
app.get("/bill", function(req, res) {
	res.render('bill.ejs',{uid:sessionStorage.getItem('loggedin_user'),send_uid : "", send_days : ""});
	{}
});


app.post('/chart',function(req, res) {
	var startDate = req.body.startDate;
	// var end = startDate + 1;
	var freq = [0,0,0,0,0,0,0,0,0,0,0,0];
	var sum_expenses = [0,0,0,0,0,0,0,0,0,0,0,0];
	con.query("SELECT * FROM expense WHERE YEAR(date) = ? AND u_id = ?",[startDate,sessionStorage.getItem('loggedin_user')], function(err,result,fields){
		result.forEach(function(item){
			// console.log(item);
			var month = item.date.getMonth();
			freq[parseInt(month)] = freq[parseInt(month)] + 1;
			sum_expenses[parseInt(month)] = sum_expenses[parseInt(month)] + item.amount;
		});
		console.log(sum_expenses);
		res.render('dashboard.ejs',{freq : ""+JSON.stringify(freq)+"", sum_expenses : ""+JSON.stringify(sum_expenses)+"", uid: sessionStorage.getItem('loggedin_user')});
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
app.post('/addExpense', function(req, res){
	var currentUser = sessionStorage.getItem('loggedin_user');
	con.query('INSERT INTO expense(u_id,title,date,category,amount) VALUES(?,?,?,?,?)',[currentUser,req.body.title,req.body.date,req.body.cat,req.body.price], function(error,results,fields){
		if(error){
			console.log(error);
		}
		else{
			console.log('Expense Added');
			res.render('dashboard.ejs',{freq : '', sum_expenses : '', uid: sessionStorage.getItem('loggedin_user')});
		}
	});
});
app.post('/addGoal', function(req,res){
	var currentUser = sessionStorage.getItem('loggedin_user');
	con.query('INSERT INTO goals(u_id,title,date,category,amount) VALUES(?,?,?,?,?)',[currentUser,req.body.gname,req.body.date,req.body.cat,req.body.price], function(error,results,fields){
		if(error){
			console.log(error);
		}
		else{
			console.log('Goal Added');
			// res.redirect({freq : '', sum_expenses : '', uid: sessionStorage.getItem('loggedin_user')},'/dashboard');
			con.query('SELECT * FROM goals WHERE u_id = ?',[sessionStorage.getItem('loggedin_user')],function(error,results,fields){
				res.render('future.ejs',{uid: sessionStorage.getItem('loggedin_user'), results: results});
			});
		}
	});		
});

app.use('/api', router);
app.listen(3000);




//Bank
const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});

app.get('/fillbank', (req, res) => {

	for (var i = 20; i > 0; i--) {

		var userid = Math.random()*(4-1)+1;
		var accno = 21-i;
		var balance = Math.random()*(20000-5000)+5000;
		con.query('INSERT INTO BANK(userid, accno, balance) VALUES (?, ?, ?);', [userid, accno, balance], function(error,results,fields) {
			if(error) console.log(error);
			else console.log(results);
		});

	}

});

app.get('/credit', (req, res) => {

	var prev,curr;

	con.query('SELECT balance from bank where accno = 15', function(error, results, fields) {

		// prev = parseInt(results.balance.toString());
		prev = results[0].balance;
		if(error) console.log(error);
		console.log(results[0].balance);

		curr = prev + 5000;
		con.query('UPDATE BANK SET balance = ? WHERE accno = 15', [curr], function(error, results, fields) {

			if(error) console.log(error);
		});
	});

});

app.get('/debit', (req, res) => {

	var prev,curr;

	con.query('SELECT balance from bank where accno = 15', function(error, results, fields) {

		// prev = parseInt(results.balance.toString());
		prev = results[0].balance;
		if(error) console.log(error);
		console.log(results[0].balance);

		curr = prev - 200;
		con.query('UPDATE BANK SET balance = ? WHERE accno = 15', [curr], function(error, results, fields) {

			if(error) console.log(error);
		});
	});

});