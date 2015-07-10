var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');

var sockjs_opts = {};

var sockjs_events = sockjs.createServer(sockjs_opts);
sockjs_events.on('connection', function (conn) {
    conn.on('data', function (message) {
        conn.write(message);
    });
});

var static_directory = new node_static.Server(__dirname);
var server = http.createServer();
server.addListener('request', function (req, res) {
    static_directory.serve(req, res);
});
server.addListener('upgrade', function (req, res) {
    res.end();
});

sockjs_events.installHandlers(server, {prefix: '/events'});
server.listen(9999, '0.0.0.0');
