var server = require('http').createServer(),
  express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),

  app = express(),
  port = 8181;

// Main configuration
var sessionConfig = {
  secret: "PTV_LATRO",
  name: "PTV",
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

server.on('request', app);
server.listen(port, function () { console.log('PTV is listening on ' + server.address().port); });