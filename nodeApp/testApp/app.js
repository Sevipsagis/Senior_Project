var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var keys = require("./config/keys");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose = require("mongoose");
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;

var mqtt = require('mqtt')
var messageModel = require('./models/messageModel');
var client = mqtt.connect('mqtt://broker.mqttdashboard.com')

var app = express();


client.on('connect', function () {
  client.subscribe('myTopic')
})
client.on('message', function (topic, message) {
  object = JSON.parse(message);
  // roomNumber = object.room;
  // context = object.message;
  // console.log(context);
  // var document = new messageModel(object);
  // document.save((err, data) => {
  //   if(err){console.log(err)}
  //   else{console.log("save complete");console.log(data)}
  // });
  messageModel.findOneAndUpdate({ "room": object.room }, object, (err, data) => {
    if (err) console.log(err);
    console.log("Update : ", data);
  });
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/test', (req, res) => {
  client.publish("sevi/test", "send from backend");
  res.send({})
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
