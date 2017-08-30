var http = require('http');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var bodyParser= require('body-parser');
var index = require('./index');
var options, app;
app = module.exports = express();
app.all('/*', function (request, response, next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "X-Requested-With");
        response.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
        next();
    });

/**
 * Get port from environment and store in Express.
 */

var port = 3000 ;
app.set('port', port);
app.use(express.static(__dirname));
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

server.listen(port);
console.log('3000 listening')