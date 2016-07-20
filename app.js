/**
 * module dependencies
 */
var express = require('express');           // node js framework
var config = require('./config');           // app configurations
var morgan = require('morgan');             // request/response logger in terminal

/**
 * express configuration
 */
var app = express();
app.use(morgan('dev'));

/**
 * routes (POST/GET)
 */
app.get('/', function(request, response) {
    response.json({ message: "in home" });
});

/**
 * server
 */
app.listen(config.port, function(error) {
    if (error) console.log(error);
    else console.log("listening on port 3000");
});