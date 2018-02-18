'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');  
const metakontroll = require('./lib/metakontroll');
const utils = require('./lib/utils');

// Veebiserveri ettevalmistamine
const app = express();
app.set('port', (process.env.PORT || 5000));
// Sea staatiliste ressursside juurkaust
app.use(express.static(__dirname + '/public'));
// Sea vaadete kaust ja vaatetöötleja
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Esilehe kuvamine
app.get('/', (req, res) => {
  res.render('pages/index');
});

/* Metateabe kontroll
  Päringu keha:
    { url: ..., sert: ... }
*/
app.post('/metakontroll', (req, res) => {
  var url = req.body.url;
  var sert = req.body.sert;
  // Loe metateabe XML
  // Vt https://www.npmjs.com/package/request 
  request(url, (error, response, body) => {
    if (error) {
      return 'Metateabe lugemine URL-lt ' + url + ' ei õnnestu';
    }
    // Kontrolli allkiri
    // var cert = utils.pemToCert(sert);
    var cert = sert;
    var allkirjakontrolliTulem = metakontroll.verifySignature(body, cert); 
    var vastus = 'Metateabe allkiri ' +
      (allkirjakontrolliTulem ? '' : 'ei ole ') +
      'õige'; 
    // Tagasta kontrolli vastus
    res.set('Content-Type', 'text/html');
    res.send(vastus);
  });
});

// Veebiserveri käivitamine
app.listen(app.get('port'), () => {
  console.log('---- Node rakendus käivitatud ----');
});
