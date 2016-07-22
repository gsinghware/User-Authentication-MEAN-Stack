/**
 * module dependencies
 */
var express     = require('express');                   // node js framework
var morgan      = require('morgan');                    // request/response logger in terminal
var bodyParser  = require('body-parser');               // populates request.body with the value of the POST parameters
var mongoose    = require('mongoose');                  // MongoDB object modeling tool
var config      = require('./config/database');         // get the db config file
var passport	= require('passport');                  // middleware for user authentication
var cookieParser = require('cookie-parser');            // get the cookies from request
var jwt         = require('jsonwebtoken');

var port = process.env.PORT || 3000;

/**
 * express configuration
 */
var app = express();                                    // create an express application
app.use(morgan('dev'));                                 // dev for displaying minified request/response messages in terminal
app.use(express.static(__dirname + '/public'));         // static middleware handles serving up the content (JS, HTML, CSS) from public dir
app.use(bodyParser.json());                             // json format for the parameters (key-value pairs)
app.use(bodyParser.urlencoded({ extended: true }));     // allow value to be any type
app.use(passport.initialize());                         // use the passport package in our application
app.use(cookieParser());

/**
 * database connection
 */
mongoose.connect(config.database, function(error) {
	if (error) console.log(error);
	else console.log("Connected to the database");
});

/**
 * view engine setup
 */
app.set('views', __dirname + '/views');                 // point to the views folder
app.set('view engine', 'ejs');                          // EJS view engine allows you to code in HTML 

/**
 * middleware for authentication
 */
app.use(function(request, response, next) {
    console.log("in here with request, response");
    var token = request.cookies["access_token"];
    if (token) {
        jwt.verify(token, config.secretKey, function (error, user) {
            if (error) {
                request.user = false;
            } else {
                request.user = user;
                next();
            }
        });
    } else {
        request.user = false;
        next();
    }
});

/**
 * use passport stategies
 */
require('./config/passport')(passport);

/**
 * routes (POST/GET)
 */
var userRoutes = require('./routes/user.js')(express, passport);    // user api routes
app.use('/user', userRoutes);                                       // url: /user/* goes through user routes, ie. user/login, user/register

app.get('*', function(request, response) {              // everything gets rendered on the index page
    response.render('index');
});

/**
 * server
 */
app.listen(port, function(error) {
    if (error) console.log(error);
    else console.log('Listening on port 3000');
});