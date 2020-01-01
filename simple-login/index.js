let mysql = require('mysql');
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path');
let app=express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('UI'));

const connection = mysql.createConnection({
    host     : 'localhost', // MYSQL HOST NAME
    user     : 'root', // MYSQL USERNAME
    password : '', // MYSQL PASSWORD
    database : 'mydb' // MYSQL DB NAME
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/UI/login.html'));
});

app.get('/signup.html', function(request, response) {
	response.sendFile(path.join(__dirname + '/UI/signUp.html'));
});

app.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
                console.log(username);
                console.log(password)
				request.session.loggedin = true;
				request.session.username = username;
                response.redirect('/home');
                console.log(done);
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
        });
        

	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
        console.log(done);
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);