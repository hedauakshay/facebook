var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var add_friend = require('./routes/add_friend');
var app = express();
var session = require('client-sessions');
// all environments
// configure the sessions with our application
app.use(session({
	cookieName : 'session',
	secret : 'social',
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 60 * 1000,
}));
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// For sign in page
app.get('/', home.signin);

app.use('/users', users);

//For signin page
app.get('/signin', home.signin);

//Display the home page of Facebook
app.post('/afterSignIn', home.afterSignIn);

//Log out the user and destroy the session
app.use('/logout', home.logout);

//Edit the user info
app.post('/edit_done', home.edit_done);

//Display the friends of users as well as other members of the facebook
app.post('/frnd_func', home.frnd_func);

//Handles the friend request feature
app.post('/frnd_req', home.frnd_req);

//Handles the creation of new group
app.post('/cn_group', home.cn_group);

//Handles the feature to remove out of the group
app.post('/d_group', home.d_group);

//Handles the feature to join existing group
app.post('/je_group', home.je_group);

//Admin delete group function
app.post('/del_group', home.del_group);

//Handles the group page
app.post('/group_view', home.group_view);

//Handles the chat feature of group
app.post('/group_comment', home.group_comment);

//Handels the news feed
app.post('/status', home.status);

//Redirect to register page
app.get('/reg', function(req, res){
	  res.render('reg', {
	    title: 'Register'
	  });
	});

//This api handles the list of groups user a part of
app.use('/d_list_group', home.d_list_group);

app.get('/edit', home.edit);

//Use to register new user by pushing data to database
app.post('/regis', home.register);

//Handles the add a friend feauture of facebook
app.get('/add_friend', home.add_friend);


module.exports = app;
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});