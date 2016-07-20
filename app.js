/**
 * module dependencies
 */
var express = require('express');                       // node js framework
var config = require('./config');                       // application configurations
var morgan = require('morgan');                         // request/response logger in terminal

/**
 * express configuration
 */
var app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));         // static middleware handles serving up the content (JS, HTML, CSS) from public dir

/**
 * view engine setup
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');                          // EJS view engine allows you to code in HTML 

/**
 * routes (POST/GET)
 */
app.get('*', function(request, response) {
    response.render('index.ejs');
});

/**
 * server
 */
app.listen(config.port, function(error) {
    if (error) console.log(error);
    else console.log('Listening on port 3000');
});