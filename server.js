var http = require('http');
var sockjs = require('sockjs');
var nodeStatic = require('node-static');
var contactManager = require('./contacts-manager/index.js');

// creates a websocket server and manages the connection with the browser
var sockjsOptions = {};
var sockjsEvents = sockjs.createServer(sockjsOptions);
sockjsEvents.on('connection', function(connection) {
    contactManager(connection);
});

// serves the content of the webapp directory
var staticDirectory = new nodeStatic.Server(__dirname + '/public');
var server = http.createServer();
server.addListener('request', function (req, res) {
    staticDirectory.serve(req, res);
});
server.addListener('upgrade', function (req, res) {
    res.end();
});

sockjsEvents.installHandlers(server, {prefix: '/events'});
server.listen(9999, '0.0.0.0');
