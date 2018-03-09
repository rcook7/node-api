var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var mongoose = require('mongoose');

var posts = require('./routes/post.js');
var todos = require('./routes/todo.js');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blog');

var app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  console.log('blocking cors');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "DELETE"]);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function(req, res, next) {
  var allowedIPs = [
    '::ffff:192.168.0.211',
    '::ffff:192.168.0.212',
    '::ffff:192.168.0.213',
    '::ffff:192.168.0.214',
    '::ffff:192.168.0.215',
    '::ffff:192.168.0.200',
    '::ffff:192.168.0.238',
    '::ffff:192.168.0.239',
    '::1'
  ];
  console.log(req.ip);
  if(allowedIPs.includes(req.ip)) {
    next();
  } else {
    res.json({'status': 'ok'});
  }
});

//Register routes
app.use('/api/posts', posts);
app.use('/api/todos', todos);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('API Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
