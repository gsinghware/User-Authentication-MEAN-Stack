/**
 * module dependencies
 */
var express     = require('express');                   // node js framework
var morgan      = require('morgan');                    // request/response logger in terminal
var bodyParser  = require('body-parser');               // populates request.body with the value of the POST parameters
var mongoose    = require('mongoose');                  // MongoDB object modeling tool
var config      = require('./config/database');         // get the db config file

var port = process.env.PORT || 3000;

/**
 * express configuration
 */
var app = express();                                    // create an express application
app.use(morgan('dev'));                                 // dev for displaying minified request/response messages in terminal
app.use(express.static(__dirname + '/public'));         // static middleware handles serving up the content (JS, HTML, CSS) from public dir
app.use(bodyParser.json());                             // json format for the parameters (key-value pairs)
app.use(bodyParser.urlencoded({ extended: true }));     // allow value to be any type

/**
 * database connection
 */
mongoose.connect(config.database, function(error) {
	if (error) console.log(error)
	else console.log("Connected to the database")
});

/**
 * view engine setup
 */
app.set('views', __dirname + '/views');                 // point to the views folder
app.set('view engine', 'ejs');                          // EJS view engine allows you to code in HTML 

/**
 * routes (POST/GET)
 */
var userRoutes = require('./routes/user.js')(express);  // user api routes
app.use('/user', userRoutes);                           // /user/* goes through user routes, ie. user/login, user/register

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