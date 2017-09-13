var http = require('http');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var bodyParser= require('body-parser');
var index = require('./index');
var options, app;
app = module.exports = express();
app.all("/api/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization,   Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
})

/**
 * Get port from environment and store in Express.
 */

var port = 8000 ;
app.set('port', port);
app.use(express.static(__dirname));
/**
 * Create HTTP server.
 */

var server = http.createServer(app);

server.listen(port);
console.log('3000 listening')