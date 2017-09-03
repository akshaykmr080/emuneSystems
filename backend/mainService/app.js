var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Promise  = require('Promise');
var cors = require('cors');
var addService = require('./routes/addService');

var patientService = require('./services/patientService');
var doctorService = require('./services/doctorService');
const ServiceRegistry = require('./serviceRegistry');
const serviceRegistry = new ServiceRegistry();

//var index = require('./routes/index');
//var users = require('./routes/users');

var app = express();

//set the service registry

app.set('serviceRegistry' , serviceRegistry)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*app.options("*",function(req,res,next){
  res.header("Access-Control-Allow-Origin", req.get("Origin")||"*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
   //other headers here
    next();
});*/
//app.user(bodyParser.json());
// after the code that uses bodyParser and other cool stuff
var originsWhitelist = [
  'http://localhost:3000',      //this is my front-end url for development

   'http://www.myproductionurl.com'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}

//here is the magic
app.use(cors(corsOptions));

//app.use('/', index);
//add the service to service registry
addService.init(serviceRegistry)
app.use('/addservice',addService.router);
patientService.init(serviceRegistry);
doctorService.init(serviceRegistry);
//app.use('/patientsData',)
app.use('/patient',patientService.router);
app.use('/doctor', doctorService.router);
//app.use('/service/doctor', doctorService);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
