var express = require('express');
var bodyParser = require('body-parser');
var ParseServer = require('parse-server').ParseServer;
var http = require('http');

var SUCCESS = 200;
var BADREQUEST = 400;
var NOTFOUND = 404;
var UNKNOWN_CLIENT_ERROR = 500;

// Basic Functiosn
function responseLogger(status, message) {
  console.log(status + ' - ' + message);
}

function isEmpty(arr) {
  return JSON.stringify(arr) === JSON.stringify({}) ? true : false;
}

// Parse App
var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;
if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var appId = 'VanHacks';
var masterKey = 'spiderman';
var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || appId ||'myAppId',
  masterKey: process.env.MASTER_KEY || masterKey || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337'  // Don't forget to change to https if needed
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
var port = process.env.PORT || 1337;
app.listen(port, function() {
  console.log('VanHacks project running on port ' + port + '.');
});



// External API Endpoints
// Reverse geocoding to get address from coordinates
// var getRequest = http.get(url, function (response) {
//     var buffer = '', data, route;
//
//     response.on("data", function (chunk) {
//         buffer += chunk;
//     });
//
//     response.on("end", function (err) {
//         // finished transferring data
//         // dump the raw data
//         responseLogger(100, buffer);
//         data = JSON.parse(buffer);
//     });
// });

// VanHacks project
// Endpoints
app.get('/', function(req, res) {
  responseLogger(SUCCESS, 'Calling VanHacks service');
  res.success();
});

app.get('/info', function(req, res) {
  console.log(req.method + ' ' + req.url + ' Getting Info');
  var description =
  'VanHacks Project \n\
  Targeted Non-Profit Organization: Ending Violence Association of BC (by way of PeaceGeeks) works to coordinate \
  and support the work of victim-serving and other anti-violence programs in British Columbia. \n\
  Team: Madeleine Chercover, Tammy Liu, Dennis Trailin, Mathew Teoh, Daniel Tsang \n\
  Challenge: Its challenge to participants is to develop a mobile personal security app, designed to work as a 24/7 monitored alarm system.';
  responseLogger(SUCCESS, req.method + ' ' + req.url + '\n' + description);
  res.send(200);
});


// Twilio
var accountSid = 'AC21adaea8c9b81cba7ab6e41b6c866186';
var authToken = '92ea91beabd04e0cfd3fcbff68c8f0ae';
var twilio = require('twilio')(accountSid, authToken);

var serviceNum = '+16042391416';
var securityNum = '+16479953366';

// POST from Twilio
// @initializer text message sent to serviceNumber +16042391416
// @req.body { To, From, SmsMessagesid, Body }
// @return text to security, and back to user
app.post('/message/in', function(req, res) {
  console.log(req.method + ' ' + req.url + ' Twilio: receiving message to ' + req.body.To);
  try {
    if(isEmpty(req.body)) throw BADREQUEST;   //empty body
    if(String(req.body.To) != String(serviceNum)) throw BADREQUEST;   //not send to Twilio number

    var message = req.body.Body,
        fromNum = String(req.body.From);
    responseLogger(SUCCESS, 'Twilio received message to ' + serviceNum + ' from ' + fromNum + ', with SmsSid: ' + req.body.SmsMessageSid);

    // TODO parse message for home and current location, then send data to security

    try {
      // TODO query by phone number, and populate user data from database
      var loadUser = JSON.parse('{}'); // WIP, load from database
      var securityMessage = '<Insert security message>';

      twilio.messages.create({
        body: securityMessage,
        to: securityNum,
        from: serviceNum
      }, function(err, message) {
        if(err){
          responseLogger(UNKNOWN_CLIENT_ERROR, 'Twilio did not send security message to \n' + JSON.stringify(loadUser));
          res.status(UNKNOWN_CLIENT_ERROR).send('Twilio did not send security message from ' + fromNum);
        } else {
          responseLogger(SUCCESS, 'Twilio sent security message from ' + fromNum);

          // Respond to user with bogo message
          var reply = 'Congratulations! You just won an all expenses paid trip to Bucharest, Romania. Please call within 24 hours to claim your prize.';
          twilio.messages.create({
             body: reply,
             to: fromNum,
             from: serviceNum
          }, function(err, message) {
           if(err) {
             responseLogger(UNKNOWN_CLIENT_ERROR, 'Twilio did not reply to user\n' + JSON.stringify(req.body));
             console.log(err);
             res.status(UNKNOWN_CLIENT_ERROR).send('Twilio did not reply to user');
           } else {
             responseLogger(SUCCESS, 'Twilio responded to message');
             res.status(SUCCESS).send('Twilio client: responded to message');
           }
          });
        }
      });

    } catch(err) {
      responseLogger(err, 'VanHacks service failed to retrieve member from database');
      res.status(err).send('VanHacks service failed to retrieve member from database');
    }
  } catch (err) {
  responseLogger(err, 'Twilio message receive ERROR');
  res.status(err).send('Twilio message receive ERROR');
  }
});


// Database
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://localhost:27017/dev';



// POST from direct URL
// Called from the Android app when there is data
// @body  { phoneId?, userId }
app.get('/sendHelp', function(req, res) {
  console.log(req.method, req.url, 'VanHacks service: receiving data externally');

  //TODO get data fields from body
  var phoneNum = '';

  // db.collection("_User", function(err, collection) {
  //     collection.findOne({"phoneNumber": ''}, function(err, item) {
  //         console.log(err);
  //         res.send(item);
  //     });
  // });

  MongoClient.connect(dbUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', dbUrl);

      var collection = db.collection('_User');
      var query = { phoneNumber: phoneNum };
      collection.findOne(query, function(err, item) {
        if(err){
          console.log('Query error ', err);
        } else {
          console.log('Queried by phoneNumber ', JSON.stringify(item));
        }
        //Close connection
        db.close();
      });
    }
  });

  var loadUser = JSON.parse('{}');

  /* Temporarily send text message to security
  var securityMessage = 'A <securityMessage> from an external endpoint';
  twilio.messages.create({
    body: securityMessage,
    to: securityNum,
    from: serviceNum
  }, function(err, message) {
    if(err){
      responseLogger(UNKNOWN_CLIENT_ERROR, 'Twilio did not send security message to \n' + JSON.stringify(loadUser));
      res.status(UNKNOWN_CLIENT_ERROR).send('Twilio did not send security message from ' + fromNum);
    } else {
      responseLogger(SUCCESS, 'Twilio sent security message from ' + fromNum);
    }
  });
  */


  res.send(200);
});
