var express = require('express');
var bodyParser = require('body-parser');
var ParseServer = require('parse-server').ParseServer;

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

function responseLogger(status, success, message) {
  var message = success ? message + ' SUCCESS' : message + ' ERROR';
  console.log(status + ' - ' + message);
}

app.get('/', function(req, res) {
  logger(200, true, '/ Calling VanHacks service')
  res.status(200);
});

app.get('/info', function(req, res) {
  var description =
  'VanHacks Project \n\
  Targeted Non-Profit Organization: Ending Violence Association of BC (by way of PeaceGeeks) works to coordinate \
  and support the work of victim-serving and other anti-violence programs in British Columbia. \n\
  Team: Madeleine Chercover, Tammy Liu, Dennis Trailin, Mathew Teoh, Daniel Tsang \n\
  Challenge: Its challenge to participants is to develop a mobile personal security app, designed to work as a 24/7 monitored alarm system.';
  responseLogger(200, true, 'GET /info' + '\n' + description);
  res.send(200);
});


// Twilio

//test credentials
var accountSid = 'AC21adaea8c9b81cba7ab6e41b6c866186';
var authToken = "92ea91beabd04e0cfd3fcbff68c8f0ae";
var twilioClient = require('twilio')(accountSid, authToken);

var serviceNum = "+16042391416";
var securityNum = "+16479953366";

app.post('/log', function(req, res) {
  requestLogger(200, true, req.body);
  res.send(200);
});

app.get('/message/out', function(req, res) {
  console.log('Twilio: sending message to ' + securityNum);
  twilioClient.messages.create({
      body: "Sent message from VanHacks server",
      to: securityNum,
      from: serviceNum
  }, function(err, message) {
    if(err){
      responseLogger(500, false, 'GET /message/out Twilio create and send message');
      res.send(500).render('error', { error: err });
    } else {
      var sId = message.sid;
      responseLogger(200, true, 'GET /message/out Twilio create and send message');
      res.status(200).send('Twilio client: sending message');
    }
  });
});

// Post new incoming message to service
app.post('/message/in', function(req, res) {
   console.log('Twilio: receiving message to ' + serviceNum + '\n' + req);

   if (twilio.validateExpressRequest(req, 'YOUR_TWILIO_AUTH_TOKEN')) {
         var resp = new twilio.TwimlResponse();
         resp.say('yayayayayayaya ');

         res.type('text/xml');
         res.send(resp.toString());
     }

   var req = '';
   req += 'req ' + req;
   req += '\nmethod ' + req.method;
   req += '\nrawBody ' + req.rawBody;
   req += '\nquery ' + req.query;
   req += '\nparams ' + req.params;
   req += '\nurl ' + req.url;
   req += '\nURL ' + req.URL;
   req += '\nheaders ' + req.headers;
   console.log(body);

   var request = '\n Body ' + req.Body;
   request += '\n From ' + req.From;
   console.log(request);

    // twilioClient.messages.create({
    //   body: "Message received!! :D yayay",
    //   to: securityNum,
    //   from: serviceNum,
    // }, function(err, message) {
    //   if(err){
    //     responseLogger(500, false, 'POST /message/in Twilio response message');
    //     res.send(500).render('error', { error: err });
    //   } else ClassName.prototype.methodName = function () {
    //     responseLogger(200, true, 'POST /message/in Twilio response message');
    //     console.log(req.Body);
    //     res.status(200).send('Twilio client: responding to message');
    //   };
    // });
});
