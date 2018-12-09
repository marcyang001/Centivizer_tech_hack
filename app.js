var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var form = require('./routes/form');
var interact = require('./routes/interact');
var  pagEdit= require('./routes/pagEdit');

var mongo = require('mongodb');
var monk = require('monk');

var app = express();


var db = monk('localhost:27017/picinfo');

// view engine setup
app.use(express.static(__dirname + '/views'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// put the middleware before all the routers
// make the database accessible to all the routers
app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use('/', index);
app.use('/form', form);
app.use('/interact', interact);
app.use('/pagEdit', pagEdit);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/*
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, '/views/error.html'));
});
*/
module.exports = app;
