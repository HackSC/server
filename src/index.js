#!/usr/bin/env nodejs
var express     = require('express');
var app         = express(); // create express app
var server      = require('http').Server(app);
var bodyParser  = require('body-parser');
var request     = require('request');

// configurations
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.get('/subscribe', function(req, res) {
  console.log("Test");
})

app.post('/subscribe', function (req, res) {
  var email = req.body.email.toLowerCase();
  var sendgridKey = process.env.SENDGRID_KEY;

  var sendgridAPIAddContactsOptions = {
    url: 'https://api.sendgrid.com/v3/contactdb/recipients',
    method: 'POST',
    json: true,
    headers: {
      'Authorization': 'Bearer ' + sendgridKey
    },
    body: [{ email }]
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 201) {
      // send sendgrid's confirmation
      res.json(response.body);
    } else {
      // send sendgrid's error
      console.log(response.statusCode);
      res.status(response.statusCode).json(error);
    }
  }

  request(sendgridAPIAddContactsOptions, callback);
});

// start the server
server.listen(app.get('port'), function () {
  console.log('Running HackSC Server on port ' + app.get('port'));
});
