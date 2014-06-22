var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/wc2014tw');

var routes = require('./routes/index');
var users = require('./routes/users');

var get_matches = require('./matches');
var twitter = require('./twitter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make DB accessible to router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Parse country list

// var fs = require('fs');
// var country_list = JSON.parse(__)

var country_list = require('./country_list.json');

// console.log(country_list[0]);

var today_matches;

get_matches(function (matches) {
  today_matches = matches;
});








twitter.stream('filter', {track:'#GER'}, function(stream) {
    stream.on('data', function(data) {
        // console.log(util.inspect(data));
        console.log('#GER ----- ' + data.user.location);
    });
    // Disconnect stream after five seconds
    // setTimeout(stream.destroy, 5000);
});

twitter.stream('filter', {track:'#ARG'}, function(stream) {
    stream.on('data', function(data) {
        // console.log(util.inspect(data));
        console.log('#ARG ----- ' + data.user.location);
    });
    // Disconnect stream after five seconds
    // setTimeout(stream.destroy, 5000);
});

module.exports = app;
