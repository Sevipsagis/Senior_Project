var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var keys = require('./config/keys');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  // service: 'hotmail',
  // auth: {
  //   user: '', // generated ethereal user
  //   pass: '' // generated ethereal password
  // }
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'carmela95@ethereal.email',
    pass: 'GRUu43xabVyK7FMYEy'
  }
});

var mongoose = require("mongoose");
mongoose.connect(keys.mongoURI, { useFindAndModify: false });
mongoose.Promise = global.Promise;

var roomsModel = require('./models/roomsModel');
var dormModel = require('./models/dormModel');
var logsModel = require('./models/logsModel');

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://ec2-54-169-196-237.ap-southeast-1.compute.amazonaws.com')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

client.on('connect', function () {
  client.subscribe('iot-senior-project')
})

client.on('message', function (topic, message) {
  object = JSON.parse(message);
  console.log(object);
  room = object.room;
  month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][new Date().getMonth()];
  next_month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][new Date().getMonth() + 1];
  // function getDormPromise() {
  //   var promise = dormModel.find({}).exec();
  //   return promise;
  // };
  // var dormPromise = getDormPromise(room);
  // var dormObj = dormPromise.then((data) => {
  //   return data[0];
  // })
  // dormModel.findOneAndUpdate({}, { $inc: { total_elect: 1, total_water: 1 } }, (err, data) => {
  //   console.log(data);
  // });

  // console.log(object.elect_usage, object.water_usage);
  // console.log(parseFloat(object.elect_usage).toFixed(4), parseFloat(object.water_usage).toFixed(4));

  // sum1 += object.elect_usage
  // sum2 += parseFloat(object.elect_usage)

  // console.log("s1", sum1);
  // console.log("s2", sum2);

  dormModel.findOneAndUpdate({ "logs.name": month }, { $inc: { "logs.$.elect": object.elect_usage, "logs.$.water": object.water_usage } }, (err, data) => {
    // console.log(data);
  });

  roomsModel.findOneAndUpdate({ room: room }, { $inc: { elect_usage: object.elect_usage, water_usage: object.water_usage } }, (err, data) => {
    // console.log(data);
  });

  logsModel.findOneAndUpdate({ room: room, "logs.name": month }, { $inc: { "logs.$.elect": object.elect_usage, "logs.$.water": object.water_usage } }, (err, data) => {
    // console.log(data);
  });


})

app.get('/', (req, res) => {
  dormModel.find().exec((err, data) => {
    res.send(data[0]);
  });
});

app.put('/', (req, res) => {
  dormModel.findOneAndUpdate({}, req.body, (err, data) => {
    res.send("Updated")
  })
});

app.put('/bill/:id', (req, res) => {

  dormModel.findOneAndUpdate({ "logs.name": next_month }, { "logs.$.elect": 0, "logs.$.water": 0 }, (err, data) => {
    // console.log(data);
  });
  logsModel.findOneAndUpdate({ room: req.params.id, "logs.name": next_month }, { "logs.$.elect": 0, "logs.$.water": 0 }, (err, data) => {
    // console.log(data);
  });

  var mailOptions = {
    from: 'rented-room@prototype.kmitl',
    to: `${req.body.email}`,
    subject: `แจ้งค่าเช่าห้องประจำเดือน ${new Date().getMonth() + 1}/${new Date().getYear() + 1900}`,
    text: `เรียนคุณ ${req.body.data.firstname} ${req.body.data.lastname} ผู้เช่าห้องหมายเลข ${req.body.data.room}\n
    - ค่าเช่าห้องมูลค่า ${req.body.dorm.room_price} บาท\n
    - ค่าไฟฟ้ามูลค่า ${req.body.dorm.elect_price} x ${parseInt(req.body.data.elect_usage)} =  ${req.body.dorm.elect_price * parseInt(req.body.data.elect_usage)} บาท\n
    - ค่านํ้ามูลค่า ${req.body.dorm.water_price} x ${parseInt(req.body.data.water_usage)} =  ${req.body.dorm.water_price * parseInt(req.body.data.water_usage)} บาท\n
  รวม ${req.body.dorm.room_price + (req.body.dorm.elect_price * parseInt(req.body.data.elect_usage)) + (req.body.dorm.water_price * parseInt(req.body.data.water_usage))} บาท`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) { console.log("error"); }
    else {
      console.log(`Send to ${req.body.data.email}`);
      roomsModel.findOneAndUpdate({ room: req.params.id }, { elect_usage: 0, water_usage: 0 }, (err, data) => {
        client.publish(`iot-senior-project/${req.params.id}`, "CLEAR");
        res.send(data);
      });
    }
  });

});

app.get('/room', (req, res) => {
  roomsModel.find().exec((err, data) => {
    res.send(data);
  });
});

app.put('/room', (req, res) => {
  console.log(req.body);
  roomsModel.findOneAndUpdate({ room: req.body.room }, { ...req.body, status: true }, (err, data) => {
    res.send(data);
  });
});

app.put('/delete/:id', (req, res) => {
  console.log("delete");
  roomsModel.findOneAndUpdate({ room: req.params.id }, { personal_id: "", nationality: "", firstname: "", lastname: "", email: "", telephone: "", address: "", elect_usage: 0, water_usage: 0, status: false }, (err, data) => {
    logsModel.findOneAndUpdate({ room: req.params.id }, {
      logs: [
        { "name": "Jan", "elect": 0, "water": 0 },
        { "name": "Feb", "elect": 0, "water": 0 },
        { "name": "Mar", "elect": 0, "water": 0 },
        { "name": "Apr", "elect": 0, "water": 0 },
        { "name": "May", "elect": 0, "water": 0 },
        { "name": "Jun", "elect": 0, "water": 0 },
        { "name": "Jul", "elect": 0, "water": 0 },
        { "name": "Aug", "elect": 0, "water": 0 },
        { "name": "Sep", "elect": 0, "water": 0 },
        { "name": "Oct", "elect": 0, "water": 0 },
        { "name": "Nov", "elect": 0, "water": 0 },
        { "name": "Dec", "elect": 0, "water": 0 }
      ]
    }, (err, data) => {
      // console.log(data);
      res.send("Delete");
    });
  });
});

app.put('/room/:id', (req, res) => {
  console.log(req.body);
  roomsModel.findOneAndUpdate({ room: req.body.room }, { ...req.body }, (err, data) => {
    res.send(data);
  });
});

app.get('/logs/:id', (req, res) => {
  logsModel.find({ room: req.params.id }).exec((err, data) => {
    res.send(data[0]);
  });
});

app.get('/active', (req, res) => {
  roomsModel.find({ status: true }).exec((err, data) => {
    res.send(data);
  });
})

app.get('/inactive', (req, res) => {
  roomsModel.find({ status: false }).exec((err, data) => {
    res.send(data);
  });
})

app.get('/room/:id', (req, res) => {
  roomsModel.find({ room: req.params.id }).exec((err, data) => {
    res.send(data[0]);
  });
});

app.get('/room/:id/:command', (req, res) => {
  client.publish(`iot-senior-project/${req.params.id}`, req.params.command);
  res.send("send to mqtt.....");
});

app.get('/floor/:fl', (req, res) => {
  roomsModel.find({ floor: req.params.fl }).exec((err, data) => {
    res.send(data);
  });
});

app.put('/billall', (req, res) => {
  dormModel.findOneAndUpdate({ "logs.name": next_month }, { "logs.$.elect": 0, "logs.$.water": 0 }, (err, data) => {
    // console.log(data);
  });
  roomsModel.find({ status: true }).exec((err, data) => {
    data.forEach(elem => {

      logsModel.findOneAndUpdate({ room: elem.room, "logs.name": next_month }, { "logs.$.elect": 0, "logs.$.water": 0 }, (err, data) => {
        // console.log(data);
      });

      var mailOptions = {
        from: 'rented-room@prototype.kmitl',
        to: `${elem.email}`,
        subject: `แจ้งค่าเช่าห้องประจำเดือน ${new Date().getMonth() + 1}/${new Date().getYear() + 1900}`,
        text: `เรียนคุณ ${elem.firstname} ${elem.lastname} ผู้เช่าห้องหมายเลข ${elem.room}\n
        - ค่าเช่าห้องมูลค่า ${req.body.room_price} บาท\n
        - ค่าไฟฟ้ามูลค่า ${req.body.elect_price} x ${parseInt(elem.elect_usage)} =  ${req.body.elect_price * parseInt(elem.elect_usage)} บาท\n
        - ค่านํ้ามูลค่า ${req.body.water_price} x ${parseInt(elem.water_usage)} =  ${req.body.water_price * parseInt(elem.water_usage)} บาท\n
      รวม ${req.body.room_price + (req.body.elect_price * parseInt(elem.elect_usage)) + (req.body.water_price * parseInt(elem.water_usage))} บาท`
      };

      // var mailOptions = {
      //   from: 'summoner_benz@hotmail.com',
      //   to: `${elem.email}`,
      //   subject: 'Test Send All from smtp',
      //   text: "Hello Jaa"
      // };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) { console.log(`error to send ${elem.email}`); }
        else {
          roomsModel.findOneAndUpdate({ room: elem.room }, { elect_usage: 0, water_usage: 0 }, (err, data) => {
            client.publish(`iot-senior-project/${elem.room}`, "CLEAR");
            console.log(`Send to ${elem.email}`);
          });
        }
        res.send("Sended");
      });
    });

  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("error")
  res.send('404 page not found.');
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
