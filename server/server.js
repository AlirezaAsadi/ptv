var fs = require('fs'),
  https_option = { key: fs.readFileSync( 'config/server.key' ),cert: fs.readFileSync( 'config/server.crt' )},
  express = require('express'),
  app = express(),
  server_http = require('http').createServer(app),
  server_https = require('https').createServer(https_option, app),
  session = require('express-session'),
  bodyParser = require('body-parser'),

  port = 8181,
  port_http = port,
  port_https = port;

// Main configuration
var sessionConfig = {
  secret: "Travel_LATRO",
  name: "TL",
  proxy: true,
  resave: true,
  saveUninitialized: true
};

app.use(session(sessionConfig));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');                          // Template engine type         
app.set('views', __dirname + '/views');                 // Template path
app.use(express.static(__dirname + '/../html'));        // Static files

// Routes
require('./controllers/routeInit')(app);
require('./controllers/serviceInit')(app);

// // Run HTTP server
// server_http.listen(port_http, function () { console.log('TravelLaTrobe is listening on ' + port_http); });

// Run HTTPS server
server_https.listen(port_https, function () { console.log('TravelLaTrobe is listening on ' + port_https); });