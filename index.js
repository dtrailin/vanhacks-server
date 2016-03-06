var express = require('express');
var bodyParser = require('body-parser');
var ParseServer = require('parse-server').ParseServer;

var SUCCESS = 200;
var BADREQUEST = 400;
var NOTFOUND = 404;
var UNKNOWN_CLIENT_ERROR = 500;


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


// Endpoints
function responseLogger(status, message) {
  console.log(status + ' - ' + message);
}
function errorHandler(error) {
  console.log('Error: ' + error);
}

app.get('/', function(req, res) {
  responseLogger(SUCCESS, 'Calling VanHacks service')
  res.status(SUCCESS);
});

app.get('/info', function(req, res) {
  console.log(req.method + ' ' + req.url + 'Getting Info');
  var description =
  '\nVanHacks Project \n\
  Targeted Non-Profit Organization: Ending Violence Association of BC (by way of PeaceGeeks) works to coordinate \
  and support the work of victim-serving and other anti-violence programs in British Columbia. \n\
  Team: Madeleine Chercover, Tammy Liu, Dennis Trailin, Mathew Teoh, Daniel Tsang \n\
  Challenge: Its challenge to participants is to develop a mobile personal security app, designed to work as a 24/7 monitored alarm system.';
  responseLogger(SUCCESS, true, req.method + ' ' + req.url + '\n' + description);
  res.send(SUCCESS);
});

// Twilio

var accountSid = 'AC21adaea8c9b81cba7ab6e41b6c866186';
var authToken = '92ea91beabd04e0cfd3fcbff68c8f0ae';
var twilio = require('twilio')(accountSid, authToken);

var serviceNum = '+16042391416';
var securityNum = '+16479953366';

app.post('/log', function(req, res) {
  responseLogger(SUCCESS, req.body);
  res.send(SUCCESS);
});

app.get('/message/out', function(req, res) {
  console.log(req.method + ' ' + req.url + 'Twilio: sending message to ' + securityNum);
  twilio.messages.create({
      body: 'Sent message from VanHacks server',
      to: securityNum,
      from: serviceNum
  }, function(err, message) {
    if(err){
      responseLogger(UNKNOWN_CLIENT_ERROR, 'Twilio create and send message');
      errorHandler(err);
      res.send(UNKNOWN_CLIENT_ERROR).render('error', { error: err });
    } else {
      var sId = message.sid;
      responseLogger(SUCCESS, 'Twilio create and send message');
      res.status(SUCCESS).send('Twilio client: sending message');
    }
  });
});

// POST from Twilio
// @param text message sent to serviceNumber +16042391416
// @return text back
app.post('/message/in', function(req, res) {
   console.log(req.method + ' ' + req.url + ' Twilio: receiving message to ' + req.body.To);

   if(String(req.body.To) === serviceNum || true) {
     var sId = req.body.SmsMessageSid,
         message = req.body.Body,
         fromNum = req.body.From;

     responseLogger(SUCCESS, 'Twilio receive message');

     // TODO check database for user, and send info to security

    // User response
     twilio.messages.create({
       body: 'Message received! :D',
       to: String(fromNum),
       from: serviceNum
     }, function(err, message) {
       if(err){
         responseLogger(UNKNOWN_CLIENT_ERROR, 'Twilio response and create message\n' + req.body);
         errorHandler(JSON.stringify(err));
         res.send(UNKNOWN_CLIENT_ERROR);
       } else {
         responseLogger(SUCCESS, 'Twilio response and create message');
         res.status(SUCCESS).send('Twilio client: responding to message');
       };
     });
   } else {
     responseLogger(BADREQUEST, 'Twilio receive message');
   }
});

// POST from direct URL
// @param
app.post('/help', function(req, res) {
  console.log('VanHacks service: receiving data from ');
});
